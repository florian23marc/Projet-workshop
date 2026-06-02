<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthController extends AbstractController
{
    #[Route('/inscription', name: 'inscription', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): Response
    {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['email'], $data['password'])) {
            return $this->json(['error' => 'email/password required'], 400);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($hasher->hashPassword($user, $data['password']));
        $em->persist($user);
        $em->flush();

        return $this->json(['ok' => true], 201);
    }

    #[Route('/profil', name: 'profil', methods: ['GET'])]
    public function profile(): Response
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'unauthenticated'], 401);
        }
        return $this->json(['email' => $user->getUserIdentifier(), 'roles' => $user->getRoles()]);
    }
}
