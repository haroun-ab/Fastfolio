<?php

namespace App\Controller;

use Exception;
use DateInterval;
use App\Entity\Like;
use App\Entity\User;
use App\Entity\View;
use DateTimeImmutable;
use App\Repository\LikeRepository;
use App\Repository\UserRepository;
use App\Repository\ViewRepository;
use App\Repository\SkillRepository;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\SocialMediaRepository;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\ProjectAttachmentRepository;
use DateTime;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;

class StatisticsController extends AbstractController
{
    public $JWTEncoderInterface;
    public $userRepository;
    public $projectRepository;
    public $projectAttachmentRepository;
    public $socialMediaRepository;
    public $viewRepository;
    public $skillRepository;
    public $entityManager;
    public $httpClient;
    public $likeRepository;
    public function __construct(UserRepository $userRepository, JWTEncoderInterface $JWTEncoderInterface, ProjectRepository $projectRepository, ProjectAttachmentRepository $projectAttachmentRepository, SocialMediaRepository $socialMediaRepository, SkillRepository $skillRepository, ViewRepository $viewRepository, EntityManagerInterface $entityManager, HttpClientInterface $httpClient, LikeRepository $likeRepository)
    {
        $this->JWTEncoderInterface = $JWTEncoderInterface;
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->projectRepository = $projectRepository;
        $this->projectAttachmentRepository = $projectAttachmentRepository;
        $this->socialMediaRepository = $socialMediaRepository;
        $this->skillRepository = $skillRepository;
        $this->viewRepository = $viewRepository;
        $this->likeRepository = $likeRepository;
        $this->httpClient = $httpClient;
    }

    #[Route('/api/get-statistics', name: 'api_getstatistics')]
    public function getStatistics(Request $request): Response
    {
        $arrayResponse = [];
        $requestData = json_decode($request->getContent(), true);

        if (!array_key_exists("fakeIp", $requestData)) {
            $client = HttpClient::create();
            $response = $client->request('GET', 'https://api.ipify.org?format=json');
            $data = $response->toArray();
            $publicIp = $data['ip'];
        } else {
            $publicIp = $requestData["fakeIp"];
        }

        $userId = $requestData["userId"];

        if ($userId == null) {
            $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
            $token = $this->JWTEncoderInterface->decode($encodedToken);
            $user = $this->userRepository->findOneBy(['email' => $token['email']]);
            $userId = $user->getId();
        }

        // Est-ce que le visiteur like ou non ?
        $like = $this->likeRepository->findOneBy(["user" => $userId, "ip_address" => $publicIp]);
        $arrayResponse["isLikeSet"] = $like != null ? true : false;
        // Total des likes
        $likes = $this->likeRepository->count(["user" => $userId]);
        $arrayResponse["likes"] = $likes;
        // Nombre total de vues
        $views = $this->viewRepository->count(["user" => $userId]);
        $arrayResponse["views"] = $views;
        // Vues uniques
        $singleViews = $this->viewRepository->createQueryBuilder('i')
            ->select('COUNT(DISTINCT i.ip_address) as distinctCount')
            ->where('i.user = :userId')
            ->setParameter('userId', $userId)
            ->getQuery()->getSingleScalarResult();
        $arrayResponse["singleViews"] = $singleViews;

        $nowDate = new DateTimeImmutable();
        $lastMonth = $nowDate->sub(new DateInterval('P1M'))->format('Y-m-d');
        // $lastMonthObj = new DateTime($lastMonth);

        // Total des likes (du dernier mois)
        $likesMonthAgo = $this->likeRepository->createQueryBuilder('v')
            ->select('COUNT(v)')
            ->where('v.user = :userId')
            ->andWhere('v.date >= :lastMonth')
            ->setParameter('userId', $userId)
            ->setParameter('lastMonth', $lastMonth)
            ->getQuery()
            ->getSingleScalarResult();
        $arrayResponse["likesLastMonth"] = $likesMonthAgo;

        // Nombre total de vues (du dernier mois)

        $viewsMonthAgo = $this->viewRepository->createQueryBuilder('v')
            ->select('COUNT(v)')
            ->where('v.user = :userId')
            ->andWhere('v.date >= :lastMonth')
            ->setParameter('userId', $userId)
            ->setParameter('lastMonth', $lastMonth)
            ->getQuery()
            ->getSingleScalarResult();
        $arrayResponse["viewsLastMonth"] = $viewsMonthAgo;

        // Vues uniques (du dernier mois)
        $SingleViewsMonthAgo = $this->viewRepository->createQueryBuilder('i')
            ->select('COUNT(DISTINCT i.ip_address) as distinctCount')
            ->where('i.user = :userId')
            ->andWhere('i.date >= :lastMonth')
            ->setParameter('userId', $userId)
            ->setParameter('lastMonth', $lastMonth)
            ->getQuery()->getSingleScalarResult();

        $arrayResponse["singleViewsLastMonth"] = $SingleViewsMonthAgo;

        $response = ['message' => "Succesful request !"];
        $response = new Response(json_encode($arrayResponse));
        $response->setStatusCode(Response::HTTP_OK);
        return $response;
    }

    #[Route('/api/set-like', name: 'api_setlike')]
    public function setLike(Request $request): Response
    {
        $requestData = json_decode($request->getContent(), true);

        if (!array_key_exists("fakeIp", $requestData)) {
            $client = HttpClient::create();
            $response = $client->request('GET', 'https://api.ipify.org?format=json');
            $data = $response->toArray();
            $publicIp = $data['ip'];
        } else {
            $publicIp = $requestData["fakeIp"];
        }

        $like = $this->likeRepository->findOneBy(["user" => $requestData["userId"], "ip_address" => $publicIp]);
        if (empty($like)) {
            $like = new Like();
            $like->setIpAddress($publicIp);
            $nowDate = new DateTimeImmutable();
            $like->setDate($nowDate);
            $user = $this->userRepository->find($requestData["userId"]);
            $like->setUser($user);
            $this->entityManager->persist($like);
            $this->entityManager->flush();
            $response = ['message' => "pas trouvé !"];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_OK);
        } else {
            $this->entityManager->remove($like);
            $this->entityManager->flush();
            $response = ['message' => "trouvé !"];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_OK);
        }
        return $response;
    }


    #[Route('/api/set-view', name: 'api_setview', methods: 'POST')]
    public function setView(Request $request): Response
    {
        try {
            // $publicIp = $request->headers->get('X-Forwarded-For');
            // $publicIp = $request->getClientIp();

            $requestData = json_decode($request->getContent(), true);
            $userId = intval($requestData["userId"]);

            if (!array_key_exists("fakeIp", $requestData)) {
                $client = HttpClient::create();
                $response = $client->request('GET', 'https://api.ipify.org?format=json');
                $data = $response->toArray();
                $publicIp = $data['ip'];
            } else {
                $publicIp = $requestData["fakeIp"];
            }

            $user = $this->userRepository->find($userId);
            $view = new View;
            $nowDate = new DateTimeImmutable();
            $view->setDate($nowDate);
            $view->setUserId($user);
            $view->setIpAddress($publicIp);

            $this->entityManager->persist($view);
            $this->entityManager->flush();

            $response = ['message' => "Successful request !"];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_OK);
        } catch (Exception $e) {
            error_log('Error: ' . $e->getMessage());
            $response = ['message' => $e->getMessage()];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }

        return $response;
    }
}
