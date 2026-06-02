<?php
namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Skill;
use App\Entity\Session;
use App\Entity\MatchEntity;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $hasher;
    public function __construct(UserPasswordHasherInterface $hasher) { $this->hasher = $hasher; }

    public function load(ObjectManager $manager): void
    {
        $users = [];
        $names = ['Lucas Martin','Emma Renard','Tom Bernard','Léa Dupont','Rayan Morel','Clara Simon'];

        foreach ($names as $i => $n) {
            $u = new User();
            $email = 'user'.($i+1).'@example.test';
            $u->setEmail($email);
            $u->setFirstName(explode(' ', $n)[0]);
            $u->setLastName(explode(' ', $n)[1] ?? '');
            $u->setPassword($this->hasher->hashPassword($u, 'secret123'));
            $manager->persist($u);
            $users[] = $u;
        }

        $skill = new Skill(); $skill->setName('Python'); $manager->persist($skill);
        // assign python to first three users
        $users[0]->addSkill($skill);
        $users[1]->addSkill($skill);
        $users[2]->addSkill($skill);

        $s = new Session(); $s->setTitle('Session Python — Lucas')->setStartAt(new \DateTime('+2 days'))->setDurationMinutes(60)->setOrganizer($users[0]); $manager->persist($s);

        $m = new MatchEntity(); $m->setUser($users[0])->setScore(98)->setOffer('React.js')->setWant('Python'); $manager->persist($m);
        $m2 = new MatchEntity(); $m2->setUser($users[1])->setScore(94)->setOffer('Figma')->setWant('Python'); $manager->persist($m2);

        $manager->flush();
    }
}
