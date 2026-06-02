<?php
namespace App\Controller;

use App\Entity\Invitation;
use App\Entity\Session as SessionEntity;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class SessionController extends AbstractController
{
    #[Route('/api/sessions', methods: ['GET'])]
    public function list(EntityManagerInterface $em): Response
    {
        $rows = $em->getRepository(SessionEntity::class)->findBy([], ['startAt' => 'ASC']);
        $data = [];
        foreach ($rows as $s) {
            $data[] = [
                'id' => $s->getId(),
                'title' => $s->getTitle(),
                'startAt' => $s->getStartAt() ? $s->getStartAt()->format(DATE_ATOM) : null,
                'durationMinutes' => $s->getDurationMinutes(),
                'location' => $s->getLocation(),
                'organizer' => $s->getOrganizer() ? $s->getOrganizer()->getUserIdentifier() : null,
                'participantCount' => count($s->getParticipants()),
                'capacity' => $s->getCapacity(),
            ];
        }
        return $this->json($data);
    }

    #[Route('/api/sessions', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'unauthenticated'], 401);
        $data = json_decode($request->getContent(), true);
        $s = new SessionEntity();
        $s->setTitle($data['title'] ?? 'Session')
          ->setStartAt(new \DateTime($data['startAt'] ?? 'now'))
          ->setDurationMinutes((int)($data['durationMinutes'] ?? 60))
          ->setLocation($data['location'] ?? null)
          ->setOrganizer($user)
          ->setCapacity((int)($data['capacity'] ?? 10));
        $s->addParticipant($user);
        $em->persist($s);
        $em->flush();
        return $this->json(['ok' => true, 'id' => $s->getId()], 201);
    }

    #[Route('/api/sessions/{id}', methods: ['GET'])]
    public function detail($id, EntityManagerInterface $em): Response
    {
        $s = $em->getRepository(SessionEntity::class)->find($id);
        if (!$s) return $this->json(['error' => 'not found'], 404);
        $participants = [];
        foreach ($s->getParticipants() as $p) {
            $participants[] = ['id'=>$p->getId(), 'email'=>$p->getUserIdentifier(), 'firstName'=>$p->getFirstName(), 'lastName'=>$p->getLastName()];
        }
        return $this->json([
            'id'=>$s->getId(), 'title'=>$s->getTitle(), 'startAt'=>$s->getStartAt()? $s->getStartAt()->format(DATE_ATOM):null,
            'durationMinutes'=>$s->getDurationMinutes(), 'location'=>$s->getLocation(), 'organizer'=>$s->getOrganizer()? $s->getOrganizer()->getUserIdentifier():null,
            'capacity'=>$s->getCapacity(),
            'participantCount'=>count($participants),
            'participants'=>$participants
        ]);
    }

    #[Route('/api/sessions/{id}/join', methods: ['POST'])]
    public function join($id, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'unauthenticated'], 401);
        $s = $em->getRepository(SessionEntity::class)->find($id);
        if (!$s) return $this->json(['error'=>'not found'],404);
        if ($s->getParticipantCount() >= $s->getCapacity()) {
            return $this->json(['error'=>'capacity reached'], 400);
        }
        $s->addParticipant($user);
        $em->persist($s);
        $em->flush();
        return $this->json(['ok'=>true]);
    }

    #[Route('/api/sessions/{id}/invite', methods: ['POST'])]
    public function invite($id, Request $request, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'unauthenticated'], 401);
        $s = $em->getRepository(SessionEntity::class)->find($id);
        if (!$s) return $this->json(['error'=>'not found'],404);
        if ($s->getOrganizer() !== $user) return $this->json(['error'=>'forbidden'],403);

        $data = json_decode($request->getContent(), true);
        $email = trim(strtolower($data['email'] ?? ''));
        if (!$email) return $this->json(['error'=>'invalid email'], 400);

        $invite = new Invitation();
        $invite->setSession($s)
               ->setEmail($email)
               ->setInvitedBy($user)
               ->setStatus('pending');
        $em->persist($invite);
        $em->flush();
        return $this->json(['ok'=>true, 'id'=>$invite->getId()], 201);
    }

    #[Route('/api/sessions/{id}', methods: ['DELETE'])]
    public function delete($id, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'unauthenticated'], 401);
        $s = $em->getRepository(SessionEntity::class)->find($id);
        if (!$s) return $this->json(['error'=>'not found'],404);
        if ($s->getOrganizer() !== $user) return $this->json(['error'=>'forbidden'],403);
        $em->remove($s);
        $em->flush();
        return $this->json(['ok'=>true]);
    }

    #[Route('/api/sessions/{id}/leave', methods: ['POST'])]
    public function leave($id, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'unauthenticated'], 401);
        $s = $em->getRepository(SessionEntity::class)->find($id);
        if (!$s) return $this->json(['error'=>'not found'],404);
        $s->removeParticipant($user);
        $em->persist($s);
        $em->flush();
        return $this->json(['ok'=>true]);
    }
}
