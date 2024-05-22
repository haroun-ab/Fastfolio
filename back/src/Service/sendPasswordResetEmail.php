<?php

namespace App\Service;

use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\Mailer\MailerInterface;
// use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CustomMailer
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function sendPasswordResetEmail($user, $resetToken)
    {
        $email = (new Email())
            ->from(new Address('hrnabd@hotmail.com', 'Fastfolio'))
            ->to($user->getEmail())
            ->subject('Reset password')
            ->html(
                '<h3 style="font-size: 26px">Hello ' . $user->getFirstName() . ' ! </h3>
            <p style="font-size: 20px">
                Someone demand a password reset link with your email address (hrnabd@hotmail.com),
                
            </p>
                <p style="font-size: 20px">
            If you are that person, you have to click on the link to continue the password reset: <br>
            <a href="https://localhost:3000/reset-password/' . $resetToken . '">https://localhost:3000/reset-password/' . $resetToken . '</a><br>
            <em>WARNING : The link is valid for only one hour (60 minutes), after this time you have to request a new link ! </em>
            </p>
            <p style="font-size: 20px">
            If you are NOT the author of the password reset demand, please ignore this email. 
            </p>
            <p style="font-size: 20px">
            Please do not reply, it is an automatic email !          
            </p>'
            );
        $this->mailer->send($email);
    }
}
