<?php

namespace App\Controller;


use Exception;
use DateTimeImmutable;
use App\Repository\UserRepository;
use App\Repository\SkillRepository;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\SocialMediaRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\ProjectAttachmentRepository;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;

class ProfileController extends AbstractController
{
    public $entityManager;
    public $JWTEncoderInterface;
    public $userRepository;
    public $projectRepository;
    public $projectAttachmentRepository;
    public $socialMediaRepository;
    public $skillRepository;

    public function __construct(UserRepository $userRepository, JWTEncoderInterface $JWTEncoderInterface, ProjectRepository $projectRepository, ProjectAttachmentRepository $projectAttachmentRepository, SocialMediaRepository $socialMediaRepository, SkillRepository $skillRepository, EntityManagerInterface $entityManager)
    {
        $this->JWTEncoderInterface = $JWTEncoderInterface;
        $this->userRepository = $userRepository;
        $this->projectRepository = $projectRepository;
        $this->projectAttachmentRepository = $projectAttachmentRepository;
        $this->socialMediaRepository = $socialMediaRepository;
        $this->skillRepository = $skillRepository;
        $this->entityManager = $entityManager;
    }

    // #[Route('/api/set-profile', name: 'api_setprofile')]
    // public function setProfile(Request $request): Response
    // {
    //     $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
    //     $token = $this->JWTEncoderInterface->decode($encodedToken);
    //     $user = $this->userRepository->findOneBy(['email' => $token['email']]);
    //     $response = new Response($user);

    //     return $response;
    // }

    public static function calculateAge($birthDate)
    {

        $currentYear = date('Y');
        $age = $currentYear - explode("-", $birthDate)[0];

        // Vérifier si l'anniversaire de cette année a déjà eu lieu
        $currentMonth = date('n');
        $birthMonth = date('n', strtotime($currentYear . '-01-01'));

        if ($currentMonth < $birthMonth || ($currentMonth == $birthMonth && date('j') < date('j', strtotime($birthDate . '-' . $birthMonth . '-01')))) {
            $age--;
        }

        return $age;
    }

    #[Route('/api/get-profile', name: 'api_getprofile')]
    public static function getProfile(Request $request, JWTEncoderInterface $JWTEncoderInterface, UserRepository $userRepository, $email = null, $id = null): Response
    {

        if ($id == null) {
            if ($email == null) {
                $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
                $token = $JWTEncoderInterface->decode($encodedToken);
                $email = $token['email'];
            }
            $user = $userRepository->findOneBy(['email' => $email]);
        } else {
            $user = $userRepository->findOneBy(['id' => $id]);
        }

        $responseArray["id"] = $user->getId();
        $responseArray["email"] = $user->getEmail();
        $responseArray["firstName"] = $user->getFirstName();
        $responseArray["lastName"] = $user->getLastName();
        $responseArray["img"] = $user->getImg();
        $formatedBirthDate = $user->getBirthDate()->format('Y-m-d');
        $responseArray["birthDate"] = $formatedBirthDate;
        $responseArray["age"] = ProfileController::calculateAge($formatedBirthDate);
        $responseArray["phone"] = $user->getPhone();
        $responseArray["speciality"] = $user->getSpeciality();
        $responseArray["bio"] = $user->getBio();

        $response = new Response(json_encode($responseArray));

        return $response;
    }

    #[Route('/api/update-profile', name: 'api_updateprofile')]
    public function updateProfile(Request $request): Response
    {
        try {
            $requestData = json_decode($request->request->get('data'), true);
            $pic = $request->files->get('fileInput');

            $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
            $token = $this->JWTEncoderInterface->decode($encodedToken);
            $user = $this->userRepository->findOneBy(['email' => $token['email']]);

            $destination = $this->getParameter('kernel.project_dir') . '/public/uploads';
            $fileName = null;
            if ($pic != null) {

                $fileName = explode('.', $pic->getClientOriginalName())[0] . time() . '.' . $pic->guessExtension();


                // Déplacez le fichier téléchargé vers le dossier d'upload
                $pic->move($destination, $fileName);

                if ($user->getImg() != "no-profile-pic.png" && $user->getImg() != "no-project-pic.jpg") {
                    $oldPic = $destination . "/" . $user->getImg();
                    if ($oldPic) {
                        unlink($oldPic);
                    }
                }
            }
            $user->setFirstName($requestData['firstName']);
            $user->setLastName($requestData['lastName']);
            $birthDate = new DateTimeImmutable($requestData['birthDate']);
            $birthDate->format('Y-m-d');
            $user->setBirthDate($birthDate);
            $user->setSpeciality($requestData['speciality']);
            $user->setPhone($requestData['phone']);
            $user->setBio($requestData['bio']);

            $fileName != null ? $user->setImg($fileName) : "";

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            $response = new Response(json_encode(["message" => "Modifications réussies"]));
        } catch (Exception $e) {
            error_log('Error: ' . $e->getMessage());
            $responseMsg = ['message' => $e->getMessage()];
            $response = new Response(json_encode($responseMsg));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }

        return $response;
    }

    #[Route('/api/delete-profile', name: 'api_deleteprofile')]
    public function deleteProfile(Request $request): Response
    {
        $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
        $token = $this->JWTEncoderInterface->decode($encodedToken);
        $user = $this->userRepository->findOneBy(['email' => $token['email']]);
        $response = new Response($user);

        return $response;
    }
}
