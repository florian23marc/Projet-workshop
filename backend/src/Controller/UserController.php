<?php
namespace App\Controller;

use App\Entity\Skill;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UserController extends AbstractController
{
    #[Route('/api/user', name: 'api_user_get', methods: ['GET'])]
    public function getProfile(): Response
    {
        $user = $this->getUser();
        if (!$user instanceof User) return $this->json(['error' => 'unauthenticated'], 401);
        $skills = [];
        foreach ($user->getSkills() as $s) $skills[] = $s->getName();
        return $this->json([
            'email' => $user->getUserIdentifier(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles(),
            'skills' => $skills,
        ]);
    }

    #[Route('/api/user', name: 'api_user_update', methods: ['PUT'])]
    public function updateProfile(Request $request, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user instanceof User) return $this->json(['error' => 'unauthenticated'], 401);
        $data = json_decode($request->getContent(), true);
        if (isset($data['firstName'])) $user->setFirstName($data['firstName']);
        if (isset($data['lastName'])) $user->setLastName($data['lastName']);
        if (isset($data['skills']) && is_array($data['skills'])) {
            // sync skills: find or create skills by name
            $skillRepo = $em->getRepository(Skill::class);
            // remove all existing
            foreach ($user->getSkills() as $s) $user->removeSkill($s);
            foreach ($data['skills'] as $name) {
                $s = $skillRepo->findOneBy(['name' => $name]);
                if (!$s) { $s = new Skill(); $s->setName($name); $em->persist($s); }
                $user->addSkill($s);
            }
        }
        $em->persist($user);
        $em->flush();

        $skills = [];
        foreach ($user->getSkills() as $skill) {
            $skills[] = ['name' => $skill->getName()];
        }

        return $this->json([
            'ok' => true,
            'email' => $user->getUserIdentifier(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'skills' => $skills,
        ]);
    }
}
