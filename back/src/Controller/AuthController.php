<?php

namespace App\Controller;

use Exception;
use DateInterval;
use App\Entity\User;
use DateTimeImmutable;
use PharIo\Manifest\Author;
use App\Entity\ResetPassword;
use App\Repository\ResetPasswordRepository;
use App\Service\CustomMailer;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Csrf\TokenStorage\TokenStorageInterface as TokenStorageTokenStorageInterface;

class AuthController extends AbstractController
{
    private $jwtManager;
    private $entityManager;
    private $userRepository;
    private $tokenStorage;
    private $JWTEncoderInterface;
    private $mailer;


    public function __construct(EntityManagerInterface $entityManager, JWTTokenManagerInterface $jwtManager, UserRepository $userRepository, TokenStorageInterface $tokenStorage, JWTEncoderInterface $JWTEncoderInterface, MailerInterface $mailer)
    {
        $this->jwtManager = $jwtManager;
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->tokenStorage = $tokenStorage;
        $this->JWTEncoderInterface = $JWTEncoderInterface;
        $this->mailer = $mailer;
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
                $user->setImg("no-profile-pic.png");
                $user->setTheme(true);



                $this->entityManager->persist($user);
                $this->entityManager->flush();

                $response = ['message' => 'Successful registration ! <br> You can now sign in.'];
                $response = new Response(json_encode($response));
                $response->setStatusCode(Response::HTTP_CREATED);
            } catch (Exception $e) {
                error_log('Error: ' . $e->getMessage());
                $response = ['message' => $e->getMessage()];
                $response = new Response(json_encode($response));
                $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            }
        }
        return $response;
    }

    #[Route('/api/is-logged-in', name: 'api_isloggedin')]
    public function isLoggedIn(Request $request): Response
    {
        $arrayResponse = [];
        try {
            $encodedToken = explode(' ', $request->headers->get('Authorization'))[1];
            $token = $this->JWTEncoderInterface->decode($encodedToken);

            $user = $this->userRepository->findOneBy(['email' => $token['email']]);
            $arrayResponse["firstName"] = $user->getFirstName();
            $arrayResponse["lastName"] = $user->getLastName();
            $arrayResponse["img"] = $user->getImg();
            $arrayResponse["userId"] = $user->getId();
            $arrayResponse["isOnline"] = $user->isOnline();

            $response = new Response(json_encode($arrayResponse));
            $response->setStatusCode(Response::HTTP_OK);
        } catch (Exception $e) {
            error_log('Error: ' . $e->getMessage());
            $response = ['message' => $e->getMessage()];
            $response = new Response(json_encode($response));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }
        return $response;
    }

    #[Route('/api/send-reset-email', name: 'api_sendresetemail')]
    public function sendResetEmail(Request $request): Response
    {
        try {
            $requestData = json_decode($request->getContent(), true);


            $user = $this->userRepository->findOneBy(['email' => $requestData['email']]);
            if ($user) {

                // $resetPassword = new ResetPassword();

                // l'id du user
                // $resetPassword->setUser($user);

                // l'email du user
                // $resetPassword->setEmail($requestData['email']);

                // le token unique
                $token = uniqid(md5('reset_password'));
                $user->setToken($token);

                // la date (now + 1h)
                $nowDate = new DateTimeImmutable();
                $oneHourAfter = $nowDate->add(new DateInterval('PT1H'));
                $user->setTokenExpiresAt($oneHourAfter);

                // isUsed
                $user->setIsTokenUsed(false);

                $this->entityManager->persist($user);
                $this->entityManager->flush();

                // envoyer le lien par mail avec le token comme params
                $CustomMailer = new CustomMailer($this->mailer);
                $CustomMailer->sendPasswordResetEmail($user, $token);
                $response = new Response(json_encode($requestData));
                $response->setStatusCode(Response::HTTP_OK);
            } else {
                $response = new Response(json_encode(['message' => 'Email address not found !']));
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

    #[Route('/api/is-reset-token-valid', name: 'api_isresettoken')]
    public function isTokenValid(Request $request): Response
    {
        try {
            $requestData = json_decode($request->getContent(), true);

            // récup le token de la bdd 
            $user = $this->userRepository->findOneBy(['token' => $requestData]);

            if ($user) {
                $nowDateTime = new DateTimeImmutable();
                $tokenExpirationDateTime = $user->getTokenExpiresAt();
                if ($nowDateTime > $tokenExpirationDateTime || $user->isIsTokenUsed()) {
                    $response = new Response(json_encode(["message" => "The token is expired"]));
                    $response->setStatusCode(Response::HTTP_BAD_REQUEST);
                } else {
                    $response = new Response(json_encode(["email" => $user->getEmail()]));
                    $response->setStatusCode(Response::HTTP_OK);
                }
            } else {
                $response = new Response(json_encode(['message' => 'The token is not found']));
                $response->setStatusCode(Response::HTTP_NOT_FOUND);
            }
            // $response = new Response(json_encode($requestData));
        } catch (Exception $e) {
            error_log('Error: ' . $e->getMessage());
            $responseMsg = ['message' => $e->getMessage()];
            $response = new Response(json_encode($responseMsg));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }

        return $response;
    }

    #[Route('/api/reset-password/{email}', name: 'api_resetpassword')]
    public function resetPassword(Request $request, $email): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $user = $this->userRepository->findOneBy(['email' => $email]);
        // $token = $this->resetPasswordRepository->findOneBy(['email' => $email]);
        if (!$user->isIsTokenUsed()) {
            if (
                !preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/', $requestData['newPassword']) // si le nouveau mdp n'est pas valide (regexp)
                || $requestData["confirmNewPassword"] != $requestData['newPassword'] // si la confirmation du nouveau mdp est incorrecte
                || password_verify($requestData["newPassword"], $user->getPassword()) // si le nouveau mot de passe est similaire à l'ancien dans la bdd
            ) {
                $resMsg = ["message" => "L'ancien mot de passe est incorrecte et/ou le nouveau mot de passe est invalide et/ou la confirmation du mot de passe est incorrecte et/ou le nouveau mot de passe correspond à l'ancien !"];
                $response = new Response(json_encode($resMsg));
                $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            } else {
                // modifier le mot de passe
                $user->setPassword(password_hash($requestData['newPassword'], PASSWORD_BCRYPT));
                // set used at true (token)
                $user->setIsTokenUsed(true);
                $this->entityManager->persist($user);
                $this->entityManager->flush();
                $resMsg = ["message" => "Mot de passe modifié avec succès !"];
                $response = new Response(json_encode($resMsg));
                $response->setStatusCode(Response::HTTP_OK);
            }
        } else {
            $resMsg = ["message" => "The token is expired!"];
            $response = new Response(json_encode($resMsg));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }


        return $response;
    }
}
