<?php

namespace App\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use App\Repository\UserRepository;
use App\Repository\ProjectRepository;
use App\Repository\ProjectAttachmentRepository;
use App\Repository\SocialMediaRepository;
use App\Repository\SkillRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;

class SettingsController extends AbstractController
{
    public $JWTEncoderInterface;
    public $userRepository;
    public $projectRepository;
    public $projectAttachmentRepository;
    public $socialMediaRepository;
    public $skillRepository;
    public $entityManager;

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

    #[Route('/api/set-settings', name: 'api_setsettings')]
    public function setIsOnline(Request $request): Response
    {
        $requestData = json_decode($request->getContent(), true);

        $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
        $token = $this->JWTEncoderInterface->decode($encodedToken);
        $user = $this->userRepository->findOneBy(['email' => $token['email']]);

        $user->setIsOnline($requestData['isOnline'] ? 1 : 0);
        $user->setTheme($requestData['theme'] ? 1 : 0);
        $user->setBg($requestData['bgId']);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $response = new Response(json_encode($requestData['isOnline']));

        return $response;
    }

    #[Route('api/get-settings', name: 'api_getsettings', methods: "GET")]
    public static function getSettings(Request $request, UserRepository $userRepository, JWTEncoderInterface $JWTEncoderInterface, $userId = null): Response
    {

        $arrayResponse = [];

        if ($userId == null) {
            $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
            $token = $JWTEncoderInterface->decode($encodedToken);
            $user = $userRepository->findOneBy(['email' => $token['email']]);
        } else {
            $user = $userRepository->findOneBy(['id' => $userId]);
        }

        $arrayResponse["email"] = $user->getEmail();
        $arrayResponse["bgId"] = $user->getBg();
        $arrayResponse["theme"] = $user->getTheme();
        $arrayResponse["isOnline"] = $user->isOnline();
        $arrayResponse["userId"] = $user->getId();


        if ($userId == null) {
            $response = ['message' => 'Successful request !'];
            $response = new Response(json_encode($arrayResponse));
            $response->setStatusCode(Response::HTTP_OK);
        } else {
            $response = new Response(json_encode($arrayResponse));
        }

        return $response;
    }

    #[Route('api/change-password', name: 'api_changepassword', methods: "POST")]
    public function changePassword(Request $request): Response
    {

        $requestData = json_decode($request->getContent(), true);
        $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
        $token = $this->JWTEncoderInterface->decode($encodedToken);

        $user = $this->userRepository->findOneBy(['email' => $token['email']]);

        // $currentPasswordFromDB = 
        // if (!password_verify($requestData["currentPassword"], $user->getPassword())) {
        //     $response = new Response(json_encode("1"));
        //     $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        // } else if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/', $requestData['newPassword'])) {
        //     $response = new Response(json_encode("2"));
        //     $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        // } else if ($requestData["confirmNewPassword"] != $requestData['newPassword']) {
        //     $response = new Response(json_encode("3"));
        //     $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        // } else if ($requestData["currentPassword"] == $requestData['newPassword']) {
        //     $response = new Response(json_encode("4"));
        //     $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        // } else {
        //     $response = new Response(json_encode("ca marche"));
        //     $response->setStatusCode(Response::HTTP_OK);
        // }
        // Password@10

        if (
            !password_verify($requestData["currentPassword"], $user->getPassword()) // si l'ancien mdp est Incorrecte 
            || !preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/', $requestData['newPassword']) // si le nouveau mdp n'est pas valide (regexp)
            || $requestData["confirmNewPassword"] != $requestData['newPassword'] // si la confirmation du nouveau mdp est incorrecte
            || $requestData["currentPassword"] == $requestData['newPassword'] // si le nouveau de mdp correspond à l'ancien mdp
        ) {
            $resMsg = ["message" => "L'ancien mot de passe est incorrecte et/ou le nouveau mot de passe est invalide et/oou la confirmation du mot de passe est incorrecte et/ou le nouveau mot de passe correspond à l'ancien !"];
            $response = new Response(json_encode($resMsg));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        } else {
            // modifier le mot de passe
            $user->setPassword(password_hash($requestData['newPassword'], PASSWORD_BCRYPT));
            $this->entityManager->persist($user);
            $this->entityManager->flush();
            $resMsg = ["message" => "Mot de passe modifié avec succès !"];
            $response = new Response(json_encode($resMsg));
            $response->setStatusCode(Response::HTTP_OK);
        }
        
        return $response;
    }

    #[Route('api/delete-account', name: 'api_deleteaccount', methods: "POST")]
    public function deleteAccount(Request $request): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
        $token = $this->JWTEncoderInterface->decode($encodedToken);

        $user = $this->userRepository->findOneBy(['email' => $token['email']]);
        if (!password_verify($requestData["currentPassword"], $user->getPassword())) {
            $response = new Response(json_encode("false"));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        } else {
            try {
                $this->entityManager->remove($user);
                $this->entityManager->flush();
            } catch (Exception $e) {
                error_log('Error: ' . $e->getMessage());
                $response = ['message' => $e->getMessage()];
                $response = new Response(json_encode($response));
                $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            }
            $response = new Response(json_encode("true"));
            $response->setStatusCode(Response::HTTP_OK);
        }

        return $response;
    }
}
