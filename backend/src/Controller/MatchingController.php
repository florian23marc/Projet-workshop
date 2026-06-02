<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class MatchingController extends AbstractController
{
    #[Route('/api/match/compute', methods: ['GET'])]
    public function compute(EntityManagerInterface $em, Request $request): Response
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'unauthenticated'], 401);
        $userSkills = [];
        foreach ($user->getSkills() as $s) $userSkills[] = $s->getName();

        $all = $em->getRepository(User::class)->findAll();
        $results = [];
        foreach ($all as $other) {
            if ($other->getId() === $user->getId()) continue;
            $otherSkills = [];
            foreach ($other->getSkills() as $s) $otherSkills[] = $s->getName();
            $common = array_intersect($userSkills, $otherSkills);
            $score = count($common) * 25; // simple scoring
            if ($score>0) {
                $results[] = ['name' => $other->getUserIdentifier(), 'score' => $score, 'common' => array_values($common)];
            }
        }
        usort($results, fn($a,$b)=>$b['score']-$a['score']);
        return $this->json($results);
    }
}
