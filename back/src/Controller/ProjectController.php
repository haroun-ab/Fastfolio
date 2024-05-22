<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\ProjectAttachment;
use Exception;
use App\Repository\UserRepository;
use App\Repository\SkillRepository;
use App\Repository\ProjectRepository;
use App\Repository\SocialMediaRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\ProjectAttachmentRepository;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Doctrine\ORM\EntityManagerInterface;

class ProjectController extends AbstractController
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

    #[Route('/api/set-project', name: 'api_setproject')]
    public function setProject(Request $request): Response
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
                    unlink($oldPic);
                }
            }

            $project = new Project();
            $project->setUserId($user);
            $project->setTitle($requestData['title']);
            $project->setDescription($requestData['description']);
            $fileName != null ? $project->setImg($fileName) : $project->setImg("no-project-pic.jpg");

            $this->entityManager->persist($project);
            $this->entityManager->flush();

            $projects = ProjectController::getAllProjects($request, $this->projectRepository, $this->JWTEncoderInterface, $this->userRepository, $this->projectAttachmentRepository, $user->getId());
            $response = new Response($projects->getContent());
            $response->setStatusCode(Response::HTTP_OK);
        } catch (Exception $e) {
            error_log('Error: ' . $e->getMessage());
            $responseMsg = ['message' => $e->getMessage()];
            $response = new Response(json_encode($responseMsg));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }
        return $response;
    }

    #[Route('/api/get-all-projects', name: 'api_getallprojects')]
    public static function getAllProjects(Request $request,  ProjectRepository $projectRepository, JWTEncoderInterface $JWTEncoderInterface, UserRepository $userRepository, ProjectAttachmentRepository $projectAttachmentRepository, $id = null): Response
    {
        $responseArray = [];

        if ($id === null) {
            $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
            $token = $JWTEncoderInterface->decode($encodedToken);
            $user = $userRepository->findOneBy(['email' => $token['email']]);
            $id = $user->getId();
        }

        $projects = $projectRepository->findBy(['user' => $id]);
        foreach ($projects as $project) {
            $ArrayRow = [];
            $ArrayRow["id"] = $project->getId();
            $ArrayRow["title"] = $project->getTitle();
            $ArrayRow["img"] = $project->getImg();
            $ArrayRow["description"] = $project->getDescription();


            $attachments = $projectAttachmentRepository->findAll();

            // $response = new Response(json_encode($attachments));
            // return $response;
            // die;
            $attachmentsArray = [];
            foreach ($attachments as $attachment) {
                if ($attachment->getProjectId()->getId() == $project->getId()) {
                    $attachmentsArray[] = [
                        "id" => $attachment->getId(),
                        "projectId" => $attachment->getProjectId()->getId(),
                        "title" => $attachment->getTitle(),
                        "url" => $attachment->getUrl(),
                    ];
                }
            }

            $ArrayRow["attachments"] = $attachmentsArray;
            $responseArray[] = $ArrayRow;
        }

        $response = new Response(json_encode($responseArray));
        return $response;
    }

    #[Route('/api/update-project/{id}', name: 'api_updateproject')]
    public function updateProject(Request $request, $id): Response
    {
        try {

            $requestData = json_decode($request->request->get('data'), true);
            $pic = $request->files->get('fileInput');

            $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
            $token = $this->JWTEncoderInterface->decode($encodedToken);
            $user = $this->userRepository->findOneBy(['email' => $token['email']]);

            if ($user) {
                $destination = $this->getParameter('kernel.project_dir') . '/public/uploads';
                $fileName = null;

                $project = $this->projectRepository->findOneBy(['id' => $id]);

                if ($pic != null) {
                    $fileName = explode('.', $pic->getClientOriginalName())[0] . time() . '.' . $pic->guessExtension();

                    // Déplacez le fichier téléchargé vers le dossier d'upload
                    $pic->move($destination, $fileName);

                    if ($project->getImg() != "no-profile-pic.png" && $project->getImg() != "no-project-pic.jpg") {
                        $oldPic = $destination . "/" . $project->getImg();
                        unlink($oldPic);
                    }
                }
                if ($project) {
                    $project->setUserId($user);
                    $project->setTitle($requestData['title']);
                    $project->setDescription($requestData['description']);
                    $fileName != null ? $project->setImg($fileName) : $project->setImg("no-project-pic.jpg");

                    $this->entityManager->persist($project);
                    $this->entityManager->flush();

                    $projects = ProjectController::getAllProjects($request, $this->projectRepository, $this->JWTEncoderInterface, $this->userRepository, $this->projectAttachmentRepository, $user->getId());
                    $response = new Response($projects->getContent());
                    $response->setStatusCode(Response::HTTP_OK);
                } else {
                    $responseMsg = ['message' => 'Project not found'];
                    $response = new Response(json_encode($responseMsg));
                    $response->setStatusCode(Response::HTTP_NOT_FOUND);
                }
            } else {
                $responseMsg = ['message' => 'User not found'];
                $response = new Response(json_encode($responseMsg));
                $response->setStatusCode(Response::HTTP_NOT_FOUND);
            }
        } catch (Exception $e) {
            error_log('Error: ' . $e->getMessage());
            $responseMsg = ['message' => $e->getMessage()];
            $response = new Response(json_encode($responseMsg));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }
        return $response;
    }

    #[Route('/api/delete-project/{id}', name: 'api_deleteproject')]
    public function deleteProject(Request $request, $id): Response
    {
        $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
        $token = $this->JWTEncoderInterface->decode($encodedToken);
        $user = $this->userRepository->findOneBy(['email' => $token['email']]);

        $project = $this->projectRepository->findOneBy(['id' => $id]);
        if ($project) {
            $this->entityManager->remove($project);
            $this->entityManager->flush();

            $projects = ProjectController::getAllProjects($request, $this->projectRepository, $this->JWTEncoderInterface, $this->userRepository, $this->projectAttachmentRepository, $user->getId());
            $response = new Response($projects->getContent());
            $response->setStatusCode(Response::HTTP_OK);
        } else {
            $responseMsg = ['message' => 'Project not found'];
            $response = new Response(json_encode($responseMsg));
            $response->setStatusCode(Response::HTTP_NOT_FOUND);
        }
        return $response;
    }

    #[Route('/api/set-project-attachment', name: 'api_setprojectattachment')]
    public function setProjectAttachment(Request $request): Response
    {
        try {
            $requestData = json_decode($request->getContent(), true);
            $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
            $token = $this->JWTEncoderInterface->decode($encodedToken);
            $user = $this->userRepository->findOneBy(['email' => $token['email']]);

            $project = $this->projectRepository->findOneBy(['id' => $requestData['projectId']]);

            $attachement = new ProjectAttachment();
            $attachement->setProjectId($project);
            $attachement->setTitle($requestData['title']);
            $attachement->setUrl($requestData['url']);

            $this->entityManager->persist($attachement);
            $this->entityManager->flush();

            $projects = ProjectController::getAllProjects($request, $this->projectRepository, $this->JWTEncoderInterface, $this->userRepository, $this->projectAttachmentRepository, $user->getId());
            $response = new Response($projects->getContent());
            $response->setStatusCode(Response::HTTP_OK);
        } catch (Exception $e) {
            $responseMsg = ['message' => $e->getMessage()];
            $response = new Response(json_encode($responseMsg));
            $response->setStatusCode(Response::HTTP_NOT_FOUND);
        }

        return $response;
    }

    #[Route('/api/update-project-attachment/{id}', name: 'api_updateprojectattachment')]
    public function updateProjectAttachment(Request $request, $id): Response
    {
        try {
            $requestData = json_decode($request->getContent(), true);
            $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
            $token = $this->JWTEncoderInterface->decode($encodedToken);
            $user = $this->userRepository->findOneBy(['email' => $token['email']]);

            $project = $this->projectRepository->findOneBy(['id' => $requestData['projectId']]);

            $attachement = $this->projectAttachmentRepository->findOneBy(['id' => $id]);
            $attachement->setTitle($requestData['title']);
            $attachement->setUrl($requestData['url']);

            $this->entityManager->persist($attachement);
            $this->entityManager->flush();

            $projects = ProjectController::getAllProjects($request, $this->projectRepository, $this->JWTEncoderInterface, $this->userRepository, $this->projectAttachmentRepository, $user->getId());
            $response = new Response($projects->getContent());
            $response->setStatusCode(Response::HTTP_OK);
        } catch (Exception $e) {
            $responseMsg = ['message' => $e->getMessage()];
            $response = new Response(json_encode($responseMsg));
            $response->setStatusCode(Response::HTTP_NOT_FOUND);
        }

        return $response;
    }

    #[Route('/api/delete-project-attachment/{id}', name: 'api_deleteprojectattachment')]
    public function deleteProjectAttachment(Request $request, $id): Response
    {
        $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
        $token = $this->JWTEncoderInterface->decode($encodedToken);
        $user = $this->userRepository->findOneBy(['email' => $token['email']]);

        $attachment = $this->projectAttachmentRepository->findOneBy(['id' => $id]);
        if ($attachment) {
            $this->entityManager->remove($attachment);
            $this->entityManager->flush();

            $projects = ProjectController::getAllProjects($request, $this->projectRepository, $this->JWTEncoderInterface, $this->userRepository, $this->projectAttachmentRepository, $user->getId());
            $response = new Response($projects->getContent());
            $response->setStatusCode(Response::HTTP_OK);
        } else {
            $responseMsg = ['message' => 'Project not found'];
            $response = new Response(json_encode($responseMsg));
            $response->setStatusCode(Response::HTTP_NOT_FOUND);
        }
        return $response;
    }
}
