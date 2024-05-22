<?php

namespace App\Controller;

use App\Entity\Skill;
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
use PhpParser\Builder\Param;

class SkillController extends AbstractController
{
    public $JWTEncoderInterface;
    public $userRepository;
    public $projectRepository;
    public $projectAttachmentRepository;
    public $socialMediaRepository;
    public $skillRepository;
    public $entityManager;

    public function __construct(UserRepository $userRepository = null, JWTEncoderInterface $JWTEncoderInterface = null, ProjectRepository $projectRepository = null, ProjectAttachmentRepository $projectAttachmentRepository = null, SocialMediaRepository $socialMediaRepository = null, SkillRepository $skillRepository, EntityManagerInterface $entityManager)
    {
        $this->JWTEncoderInterface = $JWTEncoderInterface;
        $this->userRepository = $userRepository;
        $this->projectRepository = $projectRepository;
        $this->projectAttachmentRepository = $projectAttachmentRepository;
        $this->socialMediaRepository = $socialMediaRepository;
        $this->skillRepository = $skillRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/set-skill', name: 'api_setskill')]
    public function setSkill(Request $request): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
        $token = $this->JWTEncoderInterface->decode($encodedToken);
        $user = $this->userRepository->findOneBy(['email' => $token['email']]);

        $skill = new Skill();
        $skill->setUserId($user);
        $skill->setTitle($requestData['title']);
        $skill->setRate($requestData['rate']);

        $this->entityManager->persist($skill);
        $this->entityManager->flush();

        $skills = SkillController::getAllSkills($request, $this->skillRepository, $this->JWTEncoderInterface, $this->userRepository, $user->getId());
        $response = new Response($skills->getContent());
        $response->setStatusCode(Response::HTTP_OK);

        return $response;
    }

    #[Route('/api/get-all-skills', name: 'api_getallskills')]
    public static function getAllSkills(Request $request, SkillRepository $skillRepository, JWTEncoderInterface $JWTEncoderInterface, UserRepository $userRepository, $id = null): Response
    {
        $responseArray = [];
        $skills = 0;

        if ($id == null) {
            $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
            $token = $JWTEncoderInterface->decode($encodedToken);
            $user = $userRepository->findOneBy(['email' => $token['email']]);
            $id = $user->getId();
        }

        $skills = $skillRepository->findBy(['user' => $id]);
        foreach ($skills as $skill) {
            $ArrayRow = [];
            $ArrayRow["id"] = $skill->getId();
            $ArrayRow["title"] = $skill->getTitle();
            $ArrayRow["rate"] = $skill->getRate();
            $responseArray[] = $ArrayRow;
        }
        $response = new Response(json_encode($responseArray));
        return $response;
    }

    #[Route('/api/update-skill/{id}', name: 'api_updateskill')]
    public function updateSkill(Request $request, $id): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
        $token = $this->JWTEncoderInterface->decode($encodedToken);
        $user = $this->userRepository->findOneBy(['email' => $token['email']]);

        $skill = $this->skillRepository->findOneBy(['id' => $id]);
        $skill->setUserId($user);
        $skill->setTitle($requestData['title']);
        $skill->setRate($requestData['rate']);

        $this->entityManager->persist($skill);
        $this->entityManager->flush();

        $skills = SkillController::getAllSkills($request, $this->skillRepository, $this->JWTEncoderInterface, $this->userRepository, $user->getId());
        $response = new Response($skills->getContent());
        $response->setStatusCode(Response::HTTP_OK);

        return $response;
    }

    #[Route('/api/delete-skill/{id}', name: 'api_deleteskill')]
    public function deleteSkill(Request $request, $id): Response
    {
        $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
        $token = $this->JWTEncoderInterface->decode($encodedToken);
        $user = $this->userRepository->findOneBy(['email' => $token['email']]);

        $skill = $this->skillRepository->findOneBy(['id' => $id]);
        if ($skill) {
            $this->entityManager->remove($skill);
            $this->entityManager->flush();

            $skills = SkillController::getAllSkills($request, $this->skillRepository, $this->JWTEncoderInterface, $this->userRepository, $user->getId());
            $response = new Response($skills->getContent());
            $response->setStatusCode(Response::HTTP_OK);
        } else {
            $responseMsg = ['message' => 'Skill not found'];
            $response = new Response(json_encode($responseMsg));
            $response->setStatusCode(Response::HTTP_NOT_FOUND);
        }
        return $response;
    }
}
