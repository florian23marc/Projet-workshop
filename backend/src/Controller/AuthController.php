<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthController extends AbstractController
{
    #[Route('/connexion', name: 'connexion', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher, Security $security): Response
    {
        $data = json_decode($request->getContent(), true) ?: [];
        $email = trim(strtolower($data['email'] ?? ''));
        $password = (string)($data['password'] ?? '');

        if (!$email || !$password) {
            return $this->json(['error' => 'email/password required'], 400);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);
        if (!$user || !$hasher->isPasswordValid($user, $password)) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        $security->login($user, 'json_login');

        return $this->json(['ok' => true, 'email' => $user->getEmail()]);
    }

    #[Route('/inscription', name: 'inscription', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): Response
    {
        $data = json_decode($request->getContent(), true) ?: [];
        $email = trim(strtolower($data['email'] ?? ''));
        $password = (string) ($data['password'] ?? '');
        $firstName = trim((string) ($data['firstName'] ?? ''));
        $lastName = trim((string) ($data['lastName'] ?? ''));

        if (!$email || !$password) {
            return $this->json(['error' => 'email/password required'], 400);
        }

        if (strlen($password) < 6) {
            return $this->json(['error' => 'password must contain at least 6 characters'], 400);
        }

        if (!str_ends_with($email, '@etu-digitalschool.paris')) {
            return $this->json(['error' => 'Only @etu-digitalschool.paris email addresses are allowed'], 403);
        }

        $existing = $em->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existing) {
            return $this->json(['error' => 'email already used'], 409);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setFirstName($firstName ?: null);
        $user->setLastName($lastName ?: null);
        $user->setPassword($hasher->hashPassword($user, $password));
        $em->persist($user);
        $em->flush();

        return $this->json(['ok' => true, 'email' => $email], 201);
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(): Response
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['error' => 'unauthenticated'], 401);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getUserIdentifier(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles(),
        ]);
    }

    #[Route('/deconnexion', name: 'deconnexion')]
    public function logout(): never
    {
        throw new \LogicException('Intercepté par le firewall de sécurité.');
    }

    #[Route('/profil', name: 'profil', methods: ['GET'])]
    public function profile(): Response
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['error' => 'unauthenticated'], 401);
        }

        return $this->json(['email' => $user->getUserIdentifier(), 'roles' => $user->getRoles()]);
    }
}
