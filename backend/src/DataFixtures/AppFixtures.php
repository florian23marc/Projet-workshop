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
        // ── Skill pool ──────────────────────────────────────────────────────
        $skillNames = [
            // Gestion de projet
            'Scrum / Agile', 'Kanban', 'JIRA / Confluence', 'Trello',
            'Gestion des risques', 'Planification de projet', 'Microsoft Project',
            "Leadership d'équipe", 'Communication professionnelle',
            'Gestion budgétaire', 'Méthode Waterfall', 'OKR / KPI',
            // Développement
            'HTML / CSS', 'JavaScript', 'TypeScript', 'React.js', 'Vue.js',
            'Node.js', 'Python', 'PHP / Symfony', 'Java / Spring Boot', 'C# / .NET',
            'SQL / Bases de données', 'Git / GitHub', 'Docker', 'REST API',
            'DevOps / CI-CD', 'Linux / Shell',
        ];

        $skills = [];
        foreach ($skillNames as $name) {
            $s = new Skill();
            $s->setName($name);
            $manager->persist($s);
            $skills[$name] = $s;
        }

        // ── Helper ──────────────────────────────────────────────────────────
        $makeUser = function (string $firstName, string $lastName, string $email) use ($manager): User {
            $u = new User();
            $u->setEmail($email);
            $u->setFirstName($firstName);
            $u->setLastName($lastName);
            $u->setPassword($this->hasher->hashPassword($u, 'secret123'));
            $manager->persist($u);
            return $u;
        };

        $teach = function (User $u, array $names) use ($skills) {
            foreach ($names as $n) {
                if (isset($skills[$n])) $u->addTeachSkill($skills[$n]);
            }
        };

        $learn = function (User $u, array $names) use ($skills) {
            foreach ($names as $n) {
                if (isset($skills[$n])) $u->addLearnSkill($skills[$n]);
            }
        };

        // ── Compte principal (toujours présent après fixtures:load) ────────
        $florian = new User();
        $florian->setEmail('florianmarc@etu-digitalschool.paris');
        $florian->setFirstName('Florian');
        $florian->setLastName('Marc');
        $florian->setPassword($this->hasher->hashPassword($florian, 'Password123!'));
        $manager->persist($florian);

        // ── Profils étudiants ───────────────────────────────────────────────
        //
        // Scénario : l'utilisateur courant maîtrise [Scrum/Agile, Kanban, JIRA]
        // et veut apprendre [Trello, Gestion des risques, Planification de projet].
        //
        // → Étudiants que l'utilisateur peut former (ils veulent apprendre ses compétences)
        // → Étudiants qui peuvent former l'utilisateur (ils maîtrisent ce qu'il veut apprendre)

        // — Je peux former (learnSkills ∩ mes teachSkills) —
        $sophie = $makeUser('Sophie', 'Leclerc', 'sophie.leclerc@etu-digitalschool.paris');
        $teach($sophie, ['Python', 'React.js', 'HTML / CSS']);
        $learn($sophie, ['Scrum / Agile', 'Kanban']);          // 2 matchs → 68 %

        $antoine = $makeUser('Antoine', 'Moreau', 'antoine.moreau@etu-digitalschool.paris');
        $teach($antoine, ['SQL / Bases de données', 'Git / GitHub', 'Docker']);
        $learn($antoine, ['JIRA / Confluence', 'Scrum / Agile', 'Kanban']); // 3 matchs → 100 %

        $julie = $makeUser('Julie', 'Blanc', 'julie.blanc@etu-digitalschool.paris');
        $teach($julie, ['Node.js', 'REST API', 'TypeScript']);
        $learn($julie, ['Kanban', 'JIRA / Confluence']);        // 2 matchs → 68 %

        $theo = $makeUser('Théo', 'Girard', 'theo.girard@etu-digitalschool.paris');
        $teach($theo, ['JavaScript', 'Vue.js', 'HTML / CSS']);
        $learn($theo, ['Scrum / Agile', 'Gestion des risques']); // 1 match Scrum → 34 %

        $ines = $makeUser('Inès', 'Chabane', 'ines.chabane@etu-digitalschool.paris');
        $teach($ines, ['Python', 'DevOps / CI-CD', 'Linux / Shell']);
        $learn($ines, ['Kanban', 'JIRA / Confluence', 'Scrum / Agile']); // 3 matchs → 100 %

        // — Ils peuvent me former (teachSkills ∩ mes learnSkills) —
        $emma = $makeUser('Emma', 'Bernard', 'emma.bernard@etu-digitalschool.paris');
        $teach($emma, ['Trello', 'Gestion des risques', 'Planification de projet']); // 3 matchs → 100 %
        $learn($emma, ['React.js', 'TypeScript']);

        $hugo = $makeUser('Hugo', 'Durand', 'hugo.durand@etu-digitalschool.paris');
        $teach($hugo, ['Gestion des risques', 'Planification de projet', 'OKR / KPI']); // 2 matchs → 68 %
        $learn($hugo, ['Python', 'Java / Spring Boot']);

        $camille = $makeUser('Camille', 'Laurent', 'camille.laurent@etu-digitalschool.paris');
        $teach($camille, ['Trello', 'Microsoft Project', "Leadership d'équipe"]); // 1 match Trello → 34 %
        $learn($camille, ['JavaScript', 'HTML / CSS']);

        $nicolas = $makeUser('Nicolas', 'Rousseau', 'nicolas.rousseau@etu-digitalschool.paris');
        $teach($nicolas, ['Planification de projet', 'Gestion budgétaire', 'Méthode Waterfall']); // 1 match → 34 %
        $learn($nicolas, ['PHP / Symfony', 'DevOps / CI-CD']);

        // — Profil mixte (peut former ET être formé) —
        $yasmine = $makeUser('Yasmine', 'Benali', 'yasmine.benali@etu-digitalschool.paris');
        $teach($yasmine, ['Scrum / Agile', 'Kanban', 'Trello', 'Gestion des risques']); // peut former sur Trello/Gestion risques
        $learn($yasmine, ['JIRA / Confluence', 'Gestion budgétaire']);                   // veut apprendre JIRA

        $rayan = $makeUser('Rayan', 'Morel', 'rayan.morel@etu-digitalschool.paris');
        $teach($rayan, ['C# / .NET', 'SQL / Bases de données', 'Planification de projet']);
        $learn($rayan, ['Scrum / Agile', 'Docker']);

        // ── Sessions ────────────────────────────────────────────────────────

        // — Passées —
        $past1 = new Session();
        $past1->setTitle('Introduction à Scrum & Agile')
              ->setStartAt(new \DateTime('-30 days'))
              ->setDurationMinutes(90)
              ->setLocation('Salle B12')
              ->setCapacity(12)
              ->setOrganizer($sophie);
        $past1->addParticipant($sophie)->addParticipant($antoine)->addParticipant($julie)->addParticipant($theo);
        $manager->persist($past1);

        $past2 = new Session();
        $past2->setTitle('Atelier Git avancé — branches & rebase')
              ->setStartAt(new \DateTime('-21 days'))
              ->setDurationMinutes(60)
              ->setLocation('En ligne (Discord)')
              ->setCapacity(8)
              ->setOrganizer($antoine);
        $past2->addParticipant($antoine)->addParticipant($rayan)->addParticipant($yasmine)->addParticipant($ines);
        $manager->persist($past2);

        $past3 = new Session();
        $past3->setTitle('Docker & CI/CD : déployer facilement')
              ->setStartAt(new \DateTime('-14 days'))
              ->setDurationMinutes(120)
              ->setLocation('Labo informatique')
              ->setCapacity(10)
              ->setOrganizer($ines);
        $past3->addParticipant($ines)->addParticipant($antoine)->addParticipant($nicolas)->addParticipant($rayan)->addParticipant($hugo);
        $manager->persist($past3);

        $past4 = new Session();
        $past4->setTitle('Workshop React — Hooks & Context API')
              ->setStartAt(new \DateTime('-7 days'))
              ->setDurationMinutes(90)
              ->setLocation('En ligne (Zoom)')
              ->setCapacity(15)
              ->setOrganizer($julie);
        $past4->addParticipant($julie)->addParticipant($sophie)->addParticipant($theo)->addParticipant($emma)->addParticipant($camille);
        $manager->persist($past4);

        $past5 = new Session();
        $past5->setTitle('Gestion de projet avec JIRA')
              ->setStartAt(new \DateTime('-3 days'))
              ->setDurationMinutes(60)
              ->setLocation('Salle de conf A')
              ->setCapacity(10)
              ->setOrganizer($yasmine);
        $past5->addParticipant($yasmine)->addParticipant($emma)->addParticipant($hugo)->addParticipant($nicolas);
        $manager->persist($past5);

        // — À venir —
        $next1 = new Session();
        $next1->setTitle('Session Scrum — avec Sophie L.')
              ->setStartAt(new \DateTime('+2 days'))
              ->setDurationMinutes(60)
              ->setLocation('Salle B12')
              ->setCapacity(10)
              ->setOrganizer($sophie);
        $next1->addParticipant($sophie)->addParticipant($antoine);
        $manager->persist($next1);

        $next2 = new Session();
        $next2->setTitle('Pair Programming React — débutants bienvenus')
              ->setStartAt(new \DateTime('+5 days'))
              ->setDurationMinutes(120)
              ->setLocation('En ligne (Zoom)')
              ->setCapacity(6)
              ->setOrganizer($julie);
        $next2->addParticipant($julie)->addParticipant($theo)->addParticipant($emma);
        $manager->persist($next2);

        $next3 = new Session();
        $next3->setTitle('Introduction à Kanban & Trello')
              ->setStartAt(new \DateTime('+10 days'))
              ->setDurationMinutes(90)
              ->setLocation('En ligne (Teams)')
              ->setCapacity(12)
              ->setOrganizer($yasmine);
        $next3->addParticipant($yasmine)->addParticipant($camille)->addParticipant($nicolas);
        $manager->persist($next3);

        $next4 = new Session();
        $next4->setTitle('DevOps avancé — Kubernetes & Helm')
              ->setStartAt(new \DateTime('+14 days'))
              ->setDurationMinutes(150)
              ->setLocation('Labo informatique')
              ->setCapacity(8)
              ->setOrganizer($ines);
        $next4->addParticipant($ines)->addParticipant($rayan);
        $manager->persist($next4);

        $next5 = new Session();
        $next5->setTitle('Planification de projet — OKR & KPI en pratique')
              ->setStartAt(new \DateTime('+21 days'))
              ->setDurationMinutes(60)
              ->setLocation('Salle de conf A')
              ->setCapacity(10)
              ->setOrganizer($emma);
        $next5->addParticipant($emma)->addParticipant($hugo)->addParticipant($nicolas)->addParticipant($yasmine);
        $manager->persist($next5);

        // ── MatchEntity générique (pour /api/matches) ────────────────────────
        $m1 = new MatchEntity();
        $m1->setUser($emma)->setScore(98)->setOffer('Trello, Gestion des risques')->setWant('React.js');
        $manager->persist($m1);

        $m2 = new MatchEntity();
        $m2->setUser($hugo)->setScore(86)->setOffer('Gestion des risques, Planification de projet')->setWant('Python');
        $manager->persist($m2);

        $m3 = new MatchEntity();
        $m3->setUser($antoine)->setScore(79)->setOffer('SQL, Docker')->setWant('Scrum / Agile');
        $manager->persist($m3);

        $manager->flush();
    }
}
