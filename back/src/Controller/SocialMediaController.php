<?php

namespace App\Controller;

use App\Entity\SocialMedia;
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


class SocialMediaController extends AbstractController
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

    #[Route('/api/set-socialmedia', name: 'setsocialmedia')]
    public function setSocialMedia(Request $request): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
        $token = $this->JWTEncoderInterface->decode($encodedToken);
        $user = $this->userRepository->findOneBy(['email' => $token['email']]);

        $sm = new SocialMedia();
        $sm->setUserId($user);
        $sm->setTitle($requestData['title']);
        $sm->setUrl($requestData['url']);

        $this->entityManager->persist($sm);
        $this->entityManager->flush();

        $skills = SocialMediaController::getAllSocialMedia($request, $this->socialMediaRepository, $this->JWTEncoderInterface, $this->userRepository, $user->getId());
        $response = new Response($skills->getContent());
        $response->setStatusCode(Response::HTTP_OK);

        return $response;
    }

    #[Route('/api/get-all-socialmedia', name: 'api_getallsocialmedia')]
    public static function getAllSocialMedia(Request $request, SocialMediaRepository $socialMediaRepository, JWTEncoderInterface $JWTEncoderInterface, UserRepository $userRepository, $id = null): Response
    {
        $responseArray = [];
        $socialMedia = 0;


        if ($id === null) {
            $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
            $token = $JWTEncoderInterface->decode($encodedToken);
            $user = $userRepository->findOneBy(['email' => $token['email']]);
            $id = $user->getId();
        }

        $socialMedia = $socialMediaRepository->findBy(['user' => $id]);

        foreach ($socialMedia as $sm) {
            $ArrayRow = [];
            $ArrayRow["id"] = $sm->getId();
            $ArrayRow["title"] = $sm->getTitle();
            $ArrayRow["url"] = $sm->getUrl();
            $responseArray[] = $ArrayRow;
        }

        $response = new Response(json_encode($responseArray));

        return $response;
    }


    #[Route('/api/update-socialmedia/{id}', name: 'api_updatesocialmedia')]
    public function updateSocialMedia(Request $request, $id): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
        $token = $this->JWTEncoderInterface->decode($encodedToken);
        $user = $this->userRepository->findOneBy(['email' => $token['email']]);

        $sm = $this->socialMediaRepository->findOneBy(['id' => $id]);
        if ($sm) {
            $sm->setUserId($user);
            $sm->setTitle($requestData['title']);
            $sm->setUrl($requestData['url']);

            $this->entityManager->persist($sm);
            $this->entityManager->flush();

            $skills = SocialMediaController::getAllSocialMedia($request, $this->socialMediaRepository, $this->JWTEncoderInterface, $this->userRepository, $user->getId());
            $response = new Response($skills->getContent());
            $response->setStatusCode(Response::HTTP_OK);
        } else {
            $response = new Response(json_encode(['message' => 'Social media not found !']));
            $response->setStatusCode(Response::HTTP_NOT_FOUND);
        }
        
        return $response;
    }

    #[Route('/api/delete-socialmedia/{id}', name: 'api_deletesocialmedia')]
    public function deleteSocialMedia(Request $request, $id): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
        $token = $this->JWTEncoderInterface->decode($encodedToken);
        $user = $this->userRepository->findOneBy(['email' => $token['email']]);

        $sm = $this->socialMediaRepository->findOneBy(['id' => $id]);
        if ($sm) {

            $this->entityManager->remove($sm);
            $this->entityManager->flush();

            $skills = SocialMediaController::getAllSocialMedia($request, $this->socialMediaRepository, $this->JWTEncoderInterface, $this->userRepository, $user->getId());
            $response = new Response($skills->getContent());
            $response->setStatusCode(Response::HTTP_OK);
        } else {
            $response = new Response(json_encode(['message' => 'Social media not found !']));
            $response->setStatusCode(Response::HTTP_NOT_FOUND);
        }

        return $response;
    }
}
