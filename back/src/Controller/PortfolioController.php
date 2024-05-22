<?php

namespace App\Controller;


use App\Repository\UserRepository;
use App\Repository\SkillRepository;
use App\Repository\ProjectRepository;
use App\Controller\SocialMediaController;
use App\Repository\SocialMediaRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\ProjectAttachmentRepository;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class PortfolioController extends AbstractController
{
    public $JWTEncoderInterface;
    public $userRepository;
    public $projectRepository;
    public $projectAttachmentRepository;
    public $socialMediaRepository;
    public $skillRepository;

    public function __construct(UserRepository $userRepository, JWTEncoderInterface $JWTEncoderInterface, ProjectRepository $projectRepository, ProjectAttachmentRepository $projectAttachmentRepository, SocialMediaRepository $socialMediaRepository, SkillRepository $skillRepository)
    {
        $this->JWTEncoderInterface = $JWTEncoderInterface;
        $this->userRepository = $userRepository;
        $this->projectRepository = $projectRepository;
        $this->projectAttachmentRepository = $projectAttachmentRepository;
        $this->socialMediaRepository = $socialMediaRepository;
        $this->skillRepository = $skillRepository;
    }

    #[Route('/api/get-portfolio', name: 'api_getportfolio')]
    public function getPortfolio(Request $request, $userId = null): Response
    {
        $email = null;
        if ($userId == null) {
            // Récup du email à partir du jwt de la requête
            $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
            $token = $this->JWTEncoderInterface->decode($encodedToken);
            $email = $token['email'];
        }

        $responseArray = [];

        // Récupération du profil de l'utilisateur
        $profile = ProfileController::getProfile($request, $this->JWTEncoderInterface, $this->userRepository, $email, $userId,);
        $responseArray["profile"] = json_decode($profile->getContent());
        $userId = $responseArray["profile"]->id;

        // Récupération liste des skills
        $skills = SkillController::getAllSkills($request, $this->skillRepository, $this->JWTEncoderInterface, $this->userRepository, $userId);
        $responseArray["skills"] = json_decode($skills->getContent());

        // Récupération des réseaux sociaux
        $socialMedia = SocialMediaController::getAllSocialMedia($request, $this->socialMediaRepository, $this->JWTEncoderInterface, $this->userRepository, $userId);
        $responseArray["socialMedia"] = json_decode($socialMedia->getContent());

        // Récupération des projets
        $projects = ProjectController::getAllProjects($request, $this->projectRepository, $this->JWTEncoderInterface, $this->userRepository, $this->projectAttachmentRepository, $userId);
        $responseArray["projects"] = json_decode($projects->getContent());

        $response = new Response(json_encode($responseArray));
        return $response;
    }

    #[Route('/api/get-public-portfolio', name: 'api_getpublicportfolio', methods: "POST")]
    public function getPublicPortfolio(Request $request): Response
    {

        $userId = json_decode($request->getContent(), true);

        $responseArray = [];
        // var_dump(intval($userId));
        // die;
        // Comment faire pour envoyer l'id dans la fonction getPortfolio 
        //pour qu'il me renvoie les données de l'utilisateur
        // IL FAUDRA METTRE EN PLACE UN CONDITION "if ($user != null)"
        $responseArray["portfolio"] = json_decode($this->getPortfolio($request,  intval($userId))->getContent());


        // Récupérer les données sans faire appel au fonction 
        // $userRepository->getIsOnline...etc

        $settings = SettingsController::getSettings($request, $this->userRepository, $this->JWTEncoderInterface, $userId);
        $responseArray["settings"] = json_decode($settings->getContent());

        $response = new Response(json_encode($responseArray));
        return $response;
    }
}
