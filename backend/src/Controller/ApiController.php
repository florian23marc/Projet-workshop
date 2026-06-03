<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\MatchEntity;

class ApiController extends AbstractController
{
    #[Route('/api/search', name: 'api_search', methods: ['GET'])]
    public function search(Request $request, EntityManagerInterface $em): Response
    {
        $q = $request->query->get('q', '');
        $matches = $em->getRepository(MatchEntity::class)->createQueryBuilder('m')
            ->join('m.user','u')
            ->select('u.email as name', 'm.score as match', 'm.offer', 'm.want')
            ->where('m.want LIKE :q OR m.offer LIKE :q')
            ->setParameter('q', '%'.str_replace('%','\%',$q).'%')
            ->setMaxResults(50)
            ->getQuery()
            ->getArrayResult();

        if (!$matches) {
            $matches = [
                ['name' => 'Lucas Martin', 'match' => 98, 'offer' => ['React.js'], 'want' => ['Python']],
                ['name' => 'Emma Renard', 'match' => 94, 'offer' => ['Figma'], 'want' => ['Python']],
            ];
        }
        return $this->json(['query' => $q, 'results' => $matches]);
    }

    #[Route('/api/matches', name: 'api_matches', methods: ['GET'])]
    public function matches(EntityManagerInterface $em): Response
    {
        $rows = $em->getRepository(MatchEntity::class)->findBy([], ['score' => 'DESC']);
        $data = [];
        foreach ($rows as $r) {
            $data[] = [
                'name' => $r->getUser() ? $r->getUser()->getUserIdentifier() : 'anonymous',
                'match' => $r->getScore(),
                'offer' => $r->getOffer(),
                'want' => $r->getWant(),
            ];
        }
        if (empty($data)) {
            $data = [
                ['name' => 'Lucas Martin', 'match' => 98, 'offer' => 'React.js', 'want' => 'Python'],
                ['name' => 'Emma Renard', 'match' => 94, 'offer' => 'Figma', 'want' => 'Python'],
            ];
        }
        return $this->json($data);
    }
}
