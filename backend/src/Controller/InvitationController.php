<?php
namespace App\Controller;

use App\Entity\Invitation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class InvitationController extends AbstractController
{
    #[Route('/api/invitations', methods: ['GET'])]
    public function list(EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'unauthenticated'], 401);

        $rows = $em->getRepository(Invitation::class)->findBy(['email' => $user->getUserIdentifier(), 'status' => 'pending']);
        $data = [];
        foreach ($rows as $invite) {
            $data[] = [
                'id' => $invite->getId(),
                'sessionId' => $invite->getSession()->getId(),
                'sessionTitle' => $invite->getSession()->getTitle(),
                'from' => $invite->getInvitedBy() ? $invite->getInvitedBy()->getUserIdentifier() : null,
                'status' => $invite->getStatus(),
                'createdAt' => $invite->getCreatedAt()->format(DATE_ATOM),
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/invitations/{id}/respond', methods: ['POST'])]
    public function respond($id, Request $request, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'unauthenticated'], 401);

        $invite = $em->getRepository(Invitation::class)->find($id);
        if (!$invite) return $this->json(['error' => 'not found'], 404);
        if (strtolower($invite->getEmail()) !== strtolower($user->getUserIdentifier())) {
            return $this->json(['error' => 'forbidden'], 403);
        }

        $data = json_decode($request->getContent(), true);
        $action = strtolower(trim($data['action'] ?? ''));
        if (!in_array($action, ['accept','decline'])) {
            return $this->json(['error' => 'invalid action'], 400);
        }

        if ($action === 'accept') {
            $invite->setStatus('accepted');
            $invite->getSession()->addParticipant($user);
        } else {
            $invite->setStatus('declined');
        }

        $em->persist($invite);
        $em->flush();

        return $this->json(['ok' => true, 'status' => $invite->getStatus()]);
    }
}
