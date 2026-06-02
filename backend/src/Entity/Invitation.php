<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Session;
use App\Entity\User;

#[ORM\Entity]
#[ORM\Table(name: 'invitations')]
class Invitation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\ManyToOne(targetEntity: Session::class)]
    private $session;

    #[ORM\Column(type: 'string', length: 180)]
    private $email;

    #[ORM\ManyToOne(targetEntity: User::class)]
    private $invitedBy;

    #[ORM\Column(type: 'string', length: 20)]
    private $status = 'pending';

    #[ORM\Column(type: 'datetime')]
    private $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }
    public function getSession(): ?Session { return $this->session; }
    public function setSession(?Session $session): self { $this->session = $session; return $this; }
    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): self { $this->email = $email; return $this; }
    public function getInvitedBy(): ?User { return $this->invitedBy; }
    public function setInvitedBy(?User $user): self { $this->invitedBy = $user; return $this; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): self { $this->status = $status; return $this; }
    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(\DateTimeInterface $createdAt): self { $this->createdAt = $createdAt; return $this; }
}
