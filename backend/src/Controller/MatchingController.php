<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class MatchingController extends AbstractController
{
    #[Route('/api/match/compute', methods: ['GET'])]
    public function compute(EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user instanceof User) return $this->json(['error' => 'unauthenticated'], 401);
        $userSkills = [];
        foreach ($user->getSkills() as $s) $userSkills[] = $s->getName();

        $all = $em->getRepository(User::class)->findAll();
        $results = [];
        foreach ($all as $other) {
            if ($other->getId() === $user->getId()) continue;
            $otherSkills = [];
            foreach ($other->getSkills() as $s) $otherSkills[] = $s->getName();
            $common = array_intersect($userSkills, $otherSkills);
            $score = count($common) * 25;
            if ($score > 0) {
                $results[] = ['name' => $other->getUserIdentifier(), 'score' => $score, 'common' => array_values($common)];
            }
        }
        usort($results, fn($a, $b) => $b['score'] - $a['score']);
        return $this->json($results);
    }

    #[Route('/api/match/skills', methods: ['GET'])]
    public function matchBySkills(EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user instanceof User) return $this->json(['error' => 'unauthenticated'], 401);

        $myTeachSkills = [];
        foreach ($user->getTeachSkills() as $s) $myTeachSkills[] = $s->getName();

        $myLearnSkills = [];
        foreach ($user->getLearnSkills() as $s) $myLearnSkills[] = $s->getName();

        $all = $em->getRepository(User::class)->findAll();
        $canTeach = [];
        $canLearnFrom = [];

        foreach ($all as $other) {
            if ($other->getId() === $user->getId()) continue;

            $otherLearnSkills = [];
            foreach ($other->getLearnSkills() as $s) $otherLearnSkills[] = $s->getName();

            $otherTeachSkills = [];
            foreach ($other->getTeachSkills() as $s) $otherTeachSkills[] = $s->getName();

            $displayName = $other->getFirstName()
                ? trim($other->getFirstName() . ' ' . $other->getLastName())
                : $other->getUserIdentifier();

            // Students I can teach: their learnSkills intersect my teachSkills
            $teachMatch = array_values(array_intersect($myTeachSkills, $otherLearnSkills));
            if (count($teachMatch) > 0) {
                $canTeach[] = [
                    'name' => $displayName,
                    'email' => $other->getUserIdentifier(),
                    'skills' => $teachMatch,
                    'match' => min(100, count($teachMatch) * 34),
                ];
            }

            // Students who can teach me: their teachSkills intersect my learnSkills
            $learnMatch = array_values(array_intersect($myLearnSkills, $otherTeachSkills));
            if (count($learnMatch) > 0) {
                $canLearnFrom[] = [
                    'name' => $displayName,
                    'email' => $other->getUserIdentifier(),
                    'skills' => $learnMatch,
                    'match' => min(100, count($learnMatch) * 34),
                ];
            }
        }

        usort($canTeach, fn($a, $b) => $b['match'] - $a['match']);
        usort($canLearnFrom, fn($a, $b) => $b['match'] - $a['match']);

        return $this->json([
            'canTeach' => $canTeach,
            'canLearnFrom' => $canLearnFrom,
        ]);
    }
}
