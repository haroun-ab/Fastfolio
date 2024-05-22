<?php

namespace App\Tests\Test;

use App\Entity\User;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class Test extends WebTestCase
{
    public function testGetProfile()
    {
        // Crée un client Symfony pour simuler une requête HTTP
        $client = static::createClient();

        try {
            // Requête HTTP GET vers la route '/api/get-profile'
            $client->request('GET', '/api/get-profile', [], [], [
                'HTTP_Authorization' => 'Bearer ' . 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDA2NDkwNzYsImV4cCI6MTcwMDY1MjY3Niwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImVtYWlsIjoiaHJuYWJkQGhvdG1haWwuY29tIn0.cI3_X8rtQyb3XU4zwnPaRThF5lxaMLfBoDDBxUspqY132GV0OthOssBBgqtQgB_UdAoSV7PccahNHscA165DcfkcmRnZD3PARhOfXqE_NHA7i2PwmOgBBg_iUG5lbvDgfWFet5eyGc6HpSuPEsIkdxAKDWWN7g85nh6UF7-5DnLZSPPW4xTmQF1JiYSJLstFvs90ygGNrFoNTmhOWw5gLZhqs-jQ4hPwnN_KS6vM_wOqJQibt8fA25aVLsELmx5oUsjexReRX_Jt5jH-25qFsfVnd6xnKt9OtXpid8vJf5jKcFMgqhyUGGvatvKH7aG46iWUQ2jXpJmCzDJfl2pfKg',
            ]);
            // Reste du code de vérification...
        } catch (\Exception $e) {
            dump($e->getMessage(), $e->getTraceAsString());
            throw $e; // Pour que le test échoue et affiche les détails
        }


        // // Vérifie si la réponse HTTP est un succès
        // $this->assertResponseIsSuccessful();
        // est ce que que la réponse HTTP est un succès
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        // Vérifie si la réponse contient les données attendues
        $data = json_decode($client->getResponse()->getContent(), true);

        // Assertions sur les données
        $this->assertArrayHasKey('id', $data);
        $this->assertArrayHasKey('email', $data);
        $this->assertArrayHasKey('firstName', $data);
        $this->assertArrayHasKey('lastName', $data);
        $this->assertArrayHasKey('img', $data);
        $this->assertArrayHasKey('age', $data);
        $this->assertArrayHasKey('speciality', $data);
        $this->assertArrayHasKey('bio', $data);
    }

    public function testGetSettings()
    {
        // Crée un client Symfony pour simuler une requête HTTP
        $client = static::createClient();

        try {
            // Requête HTTP GET vers la route '/api/get-profile'
            $client->request('GET', '/api/get-settings', [], [], [
                'HTTP_Authorization' => 'Bearer ' . 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDA2NDkwNzYsImV4cCI6MTcwMDY1MjY3Niwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImVtYWlsIjoiaHJuYWJkQGhvdG1haWwuY29tIn0.cI3_X8rtQyb3XU4zwnPaRThF5lxaMLfBoDDBxUspqY132GV0OthOssBBgqtQgB_UdAoSV7PccahNHscA165DcfkcmRnZD3PARhOfXqE_NHA7i2PwmOgBBg_iUG5lbvDgfWFet5eyGc6HpSuPEsIkdxAKDWWN7g85nh6UF7-5DnLZSPPW4xTmQF1JiYSJLstFvs90ygGNrFoNTmhOWw5gLZhqs-jQ4hPwnN_KS6vM_wOqJQibt8fA25aVLsELmx5oUsjexReRX_Jt5jH-25qFsfVnd6xnKt9OtXpid8vJf5jKcFMgqhyUGGvatvKH7aG46iWUQ2jXpJmCzDJfl2pfKg',
            ]);
            // Reste du code de vérification...
        } catch (\Exception $e) {
            dump($e->getMessage(), $e->getTraceAsString());
            throw $e; // Pour que le test échoue et affiche les détails
        }


        // // Vérifie si la réponse HTTP est un succès
        // $this->assertResponseIsSuccessful();
        // est ce que que la réponse HTTP est un succès
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        // Vérifie si la réponse contient les données attendues
        $data = json_decode($client->getResponse()->getContent(), true);

        // Assertions sur les données
        $this->assertArrayHasKey('email', $data);
        $this->assertArrayHasKey('bgId', $data);
        $this->assertArrayHasKey('theme', $data);
        $this->assertArrayHasKey('isOnline', $data);
        $this->assertArrayHasKey('userId', $data);
    }

    public function testGetStatistics()
    {
        // Crée un client Symfony pour simuler une requête HTTP
        $client = static::createClient();

        try {
            // Requête HTTP GET vers la route '/api/get-profile'
            $client->request('POST', '/api/get-statistics', [], [], [
                'HTTP_Authorization' => 'Bearer ' . 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDA2NDkwNzYsImV4cCI6MTcwMDY1MjY3Niwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImVtYWlsIjoiaHJuYWJkQGhvdG1haWwuY29tIn0.cI3_X8rtQyb3XU4zwnPaRThF5lxaMLfBoDDBxUspqY132GV0OthOssBBgqtQgB_UdAoSV7PccahNHscA165DcfkcmRnZD3PARhOfXqE_NHA7i2PwmOgBBg_iUG5lbvDgfWFet5eyGc6HpSuPEsIkdxAKDWWN7g85nh6UF7-5DnLZSPPW4xTmQF1JiYSJLstFvs90ygGNrFoNTmhOWw5gLZhqs-jQ4hPwnN_KS6vM_wOqJQibt8fA25aVLsELmx5oUsjexReRX_Jt5jH-25qFsfVnd6xnKt9OtXpid8vJf5jKcFMgqhyUGGvatvKH7aG46iWUQ2jXpJmCzDJfl2pfKg',
            ], '{"userId": "null"}');
            // Reste du code de vérification...
        } catch (\Exception $e) {
            dump($e->getMessage(), $e->getTraceAsString());
            throw $e; // Pour que le test échoue et affiche les détails
        }


        // // Vérifie si la réponse HTTP est un succès
        // $this->assertResponseIsSuccessful();
        // est ce que que la réponse HTTP est un succès
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        // Vérifie si la réponse contient les données attendues
        $data = json_decode($client->getResponse()->getContent(), true);

        // Assertions sur les données
        $this->assertArrayHasKey('isLikeSet', $data);
        $this->assertArrayHasKey('likes', $data);
        $this->assertArrayHasKey('views', $data);
        $this->assertArrayHasKey('singleViews', $data);
        $this->assertArrayHasKey('likesLastMonth', $data);
        $this->assertArrayHasKey('viewsLastMonth', $data);
        $this->assertArrayHasKey('singleViewsLastMonth', $data);
    }
}
