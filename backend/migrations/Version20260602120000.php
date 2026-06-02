<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260602120000 extends AbstractMigration
{
    public function getDescription() : string
    {
        return 'Initial schema for SkillSwap: users, skills, sessions, matches, user_skills';
    }

    public function up(Schema $schema) : void
    {
        // users
        $this->addSql('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles CLOB NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(80) DEFAULT NULL, last_name VARCHAR(80) DEFAULT NULL, UNIQUE (email))');
        // skills
        $this->addSql('CREATE TABLE skills (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(120) NOT NULL, UNIQUE (name))');
        // sessions
        $this->addSql('CREATE TABLE sessions (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, organizer_id INTEGER DEFAULT NULL, title VARCHAR(255) NOT NULL, start_at DATETIME NOT NULL, duration_minutes INTEGER NOT NULL, location VARCHAR(80) DEFAULT NULL, capacity INTEGER NOT NULL, FOREIGN KEY(organizer_id) REFERENCES users(id) ON DELETE SET NULL)');
        // matches
        $this->addSql('CREATE TABLE matches (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER DEFAULT NULL, score INTEGER NOT NULL, offer VARCHAR(200) DEFAULT NULL, want VARCHAR(200) DEFAULT NULL, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)');
        // user_skills (many-to-many)
        $this->addSql('CREATE TABLE user_skills (user_id INTEGER NOT NULL, skill_id INTEGER NOT NULL, PRIMARY KEY(user_id, skill_id), FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY(skill_id) REFERENCES skills(id) ON DELETE CASCADE)');
        // session_attendees (many-to-many)
        $this->addSql('CREATE TABLE session_attendees (session_id INTEGER NOT NULL, user_id INTEGER NOT NULL, PRIMARY KEY(session_id, user_id), FOREIGN KEY(session_id) REFERENCES sessions(id) ON DELETE CASCADE, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)');
        // invitations
        $this->addSql('CREATE TABLE invitations (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, session_id INTEGER DEFAULT NULL, email VARCHAR(180) NOT NULL, invited_by_id INTEGER DEFAULT NULL, status VARCHAR(20) NOT NULL, created_at DATETIME NOT NULL, FOREIGN KEY(session_id) REFERENCES sessions(id) ON DELETE CASCADE, FOREIGN KEY(invited_by_id) REFERENCES users(id) ON DELETE SET NULL)');

        $this->addSql('CREATE INDEX IDX_SESSIONS_ORGANIZER ON sessions (organizer_id)');
        $this->addSql('CREATE INDEX IDX_MATCHES_USER ON matches (user_id)');
        $this->addSql('CREATE INDEX IDX_USER_SKILLS_SKILL ON user_skills (skill_id)');
        $this->addSql('CREATE INDEX IDX_SESSION_ATTENDEES_USER ON session_attendees (user_id)');
        $this->addSql('CREATE INDEX IDX_INVITATIONS_EMAIL ON invitations (email)');
    }

    public function down(Schema $schema) : void
    {
        $this->addSql('DROP TABLE invitations');
        $this->addSql('DROP TABLE session_attendees');
        $this->addSql('DROP TABLE user_skills');
        $this->addSql('DROP TABLE matches');
        $this->addSql('DROP TABLE sessions');
        $this->addSql('DROP TABLE skills');
        $this->addSql('DROP TABLE users');
    }
}
