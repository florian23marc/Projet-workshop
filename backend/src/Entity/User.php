<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity]
#[ORM\Table(name: 'users')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 180, unique: true)]
    private $email;

    #[ORM\Column(type: 'json')]
    private $roles = [];

    #[ORM\Column(type: 'string')]
    private $password;

    #[ORM\Column(type: 'string', length: 80, nullable: true)]
    private $firstName;

    #[ORM\Column(type: 'string', length: 80, nullable: true)]
    private $lastName;

    #[ORM\ManyToMany(targetEntity: Skill::class)]
    #[ORM\JoinTable(name: 'user_skills')]
    private $skills;

    #[ORM\ManyToMany(targetEntity: Skill::class)]
    #[ORM\JoinTable(name: 'user_teach_skills')]
    private $teachSkills;

    #[ORM\ManyToMany(targetEntity: Skill::class)]
    #[ORM\JoinTable(name: 'user_learn_skills')]
    private $learnSkills;

    public function __construct()
    {
        $this->skills = new ArrayCollection();
        $this->teachSkills = new ArrayCollection();
        $this->learnSkills = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): self { $this->email = $email; return $this; }
    public function getUserIdentifier(): string { return (string) $this->email; }
    public function getRoles(): array { $roles = $this->roles; $roles[] = 'ROLE_USER'; return array_unique($roles); }
    public function setRoles(array $roles): self { $this->roles = $roles; return $this; }
    public function getPassword(): string { return $this->password; }
    public function setPassword(string $password): self { $this->password = $password; return $this; }
    public function eraseCredentials(): void {}

    public function getFirstName(): ?string { return $this->firstName; }
    public function setFirstName(?string $v): self { $this->firstName = $v; return $this; }
    public function getLastName(): ?string { return $this->lastName; }
    public function setLastName(?string $v): self { $this->lastName = $v; return $this; }

    /** @return Collection|Skill[] */
    public function getSkills(): Collection { return $this->skills; }
    public function addSkill(Skill $s): self { if (!$this->skills->contains($s)) $this->skills->add($s); return $this; }
    public function removeSkill(Skill $s): self { $this->skills->removeElement($s); return $this; }

    /** @return Collection|Skill[] */
    public function getTeachSkills(): Collection { return $this->teachSkills; }
    public function addTeachSkill(Skill $s): self { if (!$this->teachSkills->contains($s)) $this->teachSkills->add($s); return $this; }
    public function removeTeachSkill(Skill $s): self { $this->teachSkills->removeElement($s); return $this; }

    /** @return Collection|Skill[] */
    public function getLearnSkills(): Collection { return $this->learnSkills; }
    public function addLearnSkill(Skill $s): self { if (!$this->learnSkills->contains($s)) $this->learnSkills->add($s); return $this; }
    public function removeLearnSkill(Skill $s): self { $this->learnSkills->removeElement($s); return $this; }
}
