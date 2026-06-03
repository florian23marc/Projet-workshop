<?php
namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'app:create-user', description: 'Create or reset a user account')]
class CreateUserCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $hasher,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('email', InputArgument::REQUIRED)
             ->addArgument('password', InputArgument::REQUIRED)
             ->addArgument('firstName', InputArgument::OPTIONAL, '', 'Florian')
             ->addArgument('lastName', InputArgument::OPTIONAL, '', 'Marc');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $email = $input->getArgument('email');
        $plainPassword = $input->getArgument('password');
        $firstName = $input->getArgument('firstName');
        $lastName = $input->getArgument('lastName');

        $repo = $this->em->getRepository(User::class);
        $user = $repo->findOneBy(['email' => $email]);

        if (!$user) {
            $user = new User();
            $user->setEmail($email);
            $user->setFirstName($firstName);
            $user->setLastName($lastName);
            $this->em->persist($user);
        }

        $user->setPassword($this->hasher->hashPassword($user, $plainPassword));
        $this->em->flush();

        $output->writeln("<info>✓ Compte créé/mis à jour : {$email} (mot de passe : {$plainPassword})</info>");
        return Command::SUCCESS;
    }
}
