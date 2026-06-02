<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: 'sessions')]
class Session
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $title;

    #[ORM\Column(type: 'datetime')]
    private $startAt;

    #[ORM\Column(type: 'integer')]
    private $durationMinutes;

    #[ORM\Column(type: 'string', length: 80, nullable: true)]
    private $location;

    #[ORM\Column(type: 'integer')]
    private $capacity = 10;

    #[ORM\ManyToOne(targetEntity: User::class)]
    private $organizer;

    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinTable(name: 'session_attendees')]
    private $participants;

    public function __construct()
    {
        $this->participants = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $t): self { $this->title = $t; return $this; }
    public function getStartAt(): ?\DateTimeInterface { return $this->startAt; }
    public function setStartAt(\DateTimeInterface $d): self { $this->startAt = $d; return $this; }
    public function getDurationMinutes(): ?int { return $this->durationMinutes; }
    public function setDurationMinutes(int $m): self { $this->durationMinutes = $m; return $this; }
    public function getLocation(): ?string { return $this->location; }
    public function setLocation(?string $l): self { $this->location = $l; return $this; }
    public function getCapacity(): ?int { return $this->capacity; }
    public function setCapacity(int $capacity): self { $this->capacity = $capacity; return $this; }
    public function getOrganizer(): ?User { return $this->organizer; }
    public function setOrganizer(?User $u): self { $this->organizer = $u; return $this; }

    public function getParticipantCount(): int { return $this->participants->count(); }
    /** @return Collection|User[] */
    public function getParticipants(): Collection { return $this->participants; }
    public function addParticipant(User $u): self { if (!$this->participants->contains($u)) $this->participants->add($u); return $this; }
    public function removeParticipant(User $u): self { $this->participants->removeElement($u); return $this; }
}
