<?php

namespace App\Controller;

use Exception;
use App\Entity\User;
use DateTimeImmutable;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use PharIo\Manifest\Author;

class AuthController extends AbstractController
{
    private $jwtManager;
    private $entityManager;
    private $userRepository;
    public function __construct(EntityManagerInterface $entityManager, JWTTokenManagerInterface $jwtManager, UserRepository $userRepository)
    {
        $this->jwtManager = $jwtManager;
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
    }


    #[Route('/api/signup', name: 'api_signup', methods: "POST")]
    public function signup(Request $request): Response
    {
        $requestData = json_decode($request->getContent(), true);

        $birthDateObj = new DateTimeImmutable($requestData['birthDate']);
        $nowDate = new DateTimeImmutable();
        // vérification si le mail existe 
        if ($this->userRepository->findOneBy(['email' => $requestData['email']])) {
            $response = ['error' => 'The email provided is already used.'];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }
        // vérification de tous les champs si ils sont conformes
        else if (
            !preg_match('/^[A-Za-z]{1,}$/', $requestData['firstName']) ||
            !preg_match('/^[A-Za-z]{1,}$/', $requestData['lastName'])
        ) {
            $response = ['error' => 'The provided names are not valid, please use only letters.'];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        } else if (!preg_match('/^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/', $requestData['email'])) {
            $response = ['error' => 'The provided email are not valid (expected format: example@hotmail.com).'];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        } else if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/', $requestData['password'])) {
            $response = ['error' => 'The provided password is not valid. Your password must have at least :  
            - 8 characters
            - 1 lowercase letter
            - 1 uppercase letter,
            - 1 special character (@$!%*?&)'];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        } else if ($nowDate->diff($birthDateObj)->y < 3) {
            $response = ['error' => 'User must be at least 3 years old'];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        } else {
            // Si tous les champs sont conformes alors on crée un nouvel utilisateur dans la BDD
            try {
                $user = new User;
                $user->setFirstName($requestData['firstName']);
                $user->setLastName($requestData['lastName']);
                $user->setEmail($requestData['email']);
                $user->setPassword(password_hash($requestData['password'], PASSWORD_BCRYPT));
                $birthDate = new DateTimeImmutable($requestData['birthDate']);
                $birthDate->format('Y-m-d');
                $user->setBirthDate($birthDate);

                $response = ['message' => 'Successful registration ! <br> You can now sign in.'];
                $response = new Response(json_encode($response));
                $response->setStatusCode(Response::HTTP_CREATED);

                $this->entityManager->persist($user);
                $this->entityManager->flush();
            } catch (Exception $e) {
                error_log('JSON encoding error: ' . $e->getMessage());
                $response = ['message' => $e->getMessage()];
                $response = new Response(json_encode($response));
                $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            }
        }
        return $response;
    }

    #[Route('/api/login', name: 'api_login', methods: "POST")]
    public function login(Request $request): Response
    {
        // On récupère les données de la requête AJAX
        $requestData = json_decode($request->getContent(), true);
        try {
            // vérification si le mail existe
            $user = $this->userRepository->findOneBy(['email' => $requestData['email']]);

            // si l'adresse email ou le mot de passe n'existent pas, renvoie d'une erreur 401 (non-autorisé)
            if (!$user || !password_verify($requestData['password'], $user->getPassword())) {
                $response = ['error' => "Email or password are not valid !"];
                $response = new Response(json_encode($response));
                $response->setStatusCode(Response::HTTP_UNAUTHORIZED);
            } else {
                // Sinon, connexion de l'utilisateur réussie
                $response = ['message' => 'Successful authentication !'];
                $response = new Response(json_encode($response));
                $response->setStatusCode(Response::HTTP_OK);

                $token = $this->jwtManager->create($user);

                // Créez un cookie HTTP-Only
                $cookie = new Cookie(
                    'BEARER', // Nom du cookie
                    $token, // Valeur du cookie
                    time() + 7200, // Durée de vie du cookie (1h)
                    '/', // Chemin du cookie
                    null, // Domaine
                    true, // Secure (https)
                    true, // HTTP-Only 
                    'None', // SameSite 
                    null // Version
                );



                // Créez une réponse Symfony et ajoutez le cookie à la réponse
                $response->headers->setCookie($cookie);
            }
        } catch (Exception $e) {
            error_log('JSON encoding error: ' . $e->getMessage());
            $response = ['message' => $e->getMessage()];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_UNAUTHORIZED);
        };


        // setcookie("jwtToken", "", time() - 3600, "/", "", true, true);
        return $response;
    }

    #[Route('api/testdashboard', name: 'api_testdashboard', methods: "POST")]
    public function testdashboard(Request $request): Response
    {
        // On récupère les données de la requête AJAX
        $requestData = json_decode($request->getContent(), true);
        $response = ['message' => 'Successful request !'];
        $response = new Response(json_encode($_COOKIE['BEARER']));
        $response->setStatusCode(Response::HTTP_OK);
        return $response;
    }
}
