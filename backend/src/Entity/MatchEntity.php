<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'matches')]
class MatchEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\ManyToOne(targetEntity: User::class)]
    private $user;

    #[ORM\Column(type: 'integer')]
    private $score;

    #[ORM\Column(type: 'string', length: 200, nullable: true)]
    private $offer;

    #[ORM\Column(type: 'string', length: 200, nullable: true)]
    private $want;

    public function getId(): ?int { return $this->id; }
    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $u): self { $this->user = $u; return $this; }
    public function getScore(): ?int { return $this->score; }
    public function setScore(int $s): self { $this->score = $s; return $this; }
    public function getOffer(): ?string { return $this->offer; }
    public function setOffer(?string $o): self { $this->offer = $o; return $this; }
    public function getWant(): ?string { return $this->want; }
    public function setWant(?string $w): self { $this->want = $w; return $this; }
}
