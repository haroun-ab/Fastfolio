<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use DateTimeImmutable; // Assurez-vous que cette classe est correctement importée

class AuthController extends AbstractController
{
    #[Route('/api/signup', name: 'api_signup', methods: "POST")]
    public function signup(Request $request, EntityManagerInterface $entityManager, UserRepository $userRepository): Response
    {

        $requestData = json_decode($request->getContent(), true);

        // vérification si le mail existe
        // chiffrage du mdp 
        // enregistrer le tout dans la bdd

        // vérification de tous les champs si ils sont conformes
        if (
            !preg_match('/^[A-Za-z]{1,}$/', $requestData['firstName']) &&
            !preg_match('/^[A-Za-z]{1,}$/', $requestData['lastName']) &&
            !preg_match('/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/', $requestData['email']) &&
            !preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/', $requestData['password'])
        ) {
            $response = ['message' => 'The provided data is not valid. Please check your input.'];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        } else {
            try {
                $user = new User;
                $user->setFirstName($requestData['firstName']);
                $user->setLastName($requestData['lastName']);
                $user->setEmail($requestData['email']);
                $user->setPassword(password_hash($requestData['password'], PASSWORD_BCRYPT));

                $requestData['birth_date'] = "2001-08-27";
                $birthDate = new DateTimeImmutable($requestData['birth_date']);
                $birthDate->format('Y-m-d');
                $user->setBirthDate($birthDate);

                $response = ['message' => 'Successful registration !'];
                $response = new Response(json_encode($response));
                $response->setStatusCode(Response::HTTP_CREATED);

                $entityManager->persist($user);
                $entityManager->flush();
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
    public function login(Request $request, EntityManagerInterface $entityManager, UserRepository $userRepository): Response
    {
        // On récupère les données de la requête AJAX
        $requestData = json_decode($request->getContent(), true);


        // cookie de session
        try {
            // vérification si le mail existe
            $user = $userRepository->findOneBy(['email' => $requestData['email']]);

            // si l'adresse email ou le mot de passe n'existent pas, renvoie d'une erreur 401 (non-autorisé)
            if (!$user || !password_verify($requestData['password'], $user->getPassword())) {
                $response = ['message' => "Email or password are not valid !"];
                $response = new Response(json_encode($response));
                $response->setStatusCode(Response::HTTP_UNAUTHORIZED);
            } else {
                $response = ['message' => 'Successful authentication !'];
                $response = new Response(json_encode($response));
                $response->setStatusCode(Response::HTTP_OK);
            }
        } catch (Exception $e) {
            error_log('JSON encoding error: ' . $e->getMessage());
            $response = ['message' => $e->getMessage()];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_UNAUTHORIZED);
        }

        return $response;
    }
}
