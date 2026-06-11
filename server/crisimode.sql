-- User table
CREATE TABLE IF NOT EXISTS Gebruikers (
  UUID varchar(36) PRIMARY KEY NOT NULL,
  Voornaam varchar(50) NOT NULL,
  Achternaam varchar(50) NOT NULL,
  Username varchar(50) UNIQUE NOT NULL,
  Email varchar(254) UNIQUE NOT NULL,
  Wachtwoord varchar(100) NOT NULL,
  ProfielFotoPath varchar(40)
);

-- Medaille table, UUID is foreign key to Gebruikers
CREATE TABLE IF NOT EXISTS BehaaldeMedailles (
  UUID varchar(36) PRIMARY KEY NOT NULL,
  Casus1 varchar(6) CHECK (Casus1 IN ('goud','zilver','bronze')),
  Casus2 varchar(6) CHECK (Casus2 IN ('goud','zilver','bronze')),
  Casus3 varchar(6) CHECK (Casus3 IN ('goud','zilver','bronze')),
  Casus4 varchar(6) CHECK (Casus4 IN ('goud','zilver','bronze')),
  Casus5 varchar(6) CHECK (Casus5 IN ('goud','zilver','bronze')),
  Casus6 varchar(6) CHECK (Casus6 IN ('goud','zilver','bronze')),
  Casus7 varchar(6) CHECK (Casus7 IN ('goud','zilver','bronze')),
  Casus8 varchar(6) CHECK (Casus8 IN ('goud','zilver','bronze')),
  Casus9 varchar(6) CHECK (Casus9 IN ('goud','zilver','bronze')),
  Casus10 varchar(6) CHECK (Casus10 IN ('goud','zilver','bronze')),
  FOREIGN KEY (UUID) REFERENCES Gebruikers(UUID)
);

-- VERWIJDER DE TEST ACCOUNTS VOOR RELEASE, DIT IS ALLEEN VOOR TESTEN
INSERT INTO Gebruikers (UUID, Voornaam, Achternaam, Username, Email, Wachtwoord, ProfielFotoPath) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'John', 'Doe', 'johndoe', 'john@example.com', '$2b$12$pVxHzTILo/OfGm/3tFxXqe0mA.fwUUyZNHSM6ru3.qMamJiDGoOIO', NULL), --wachtwoord is "Test%5"
('123e4567-e89b-12d3-a456-426614174001', 'Jane', 'Smith', 'janesmith', 'jane@example.com', '$2b$12$pVxHzTILo/OfGm/3tFxXqe0mA.fwUUyZNHSM6ru3.qMamJiDGoOIO', NULL); --wachtwoord is "Test%5"

INSERT INTO BehaaldeMedailles (UUID, Casus1, Casus2, Casus3, Casus4, Casus5, Casus6, Casus7, Casus8, Casus9, Casus10) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'goud', 'zilver', 'bronze', 'goud', 'zilver', 'bronze', 'goud', 'zilver', 'bronze', 'goud'),
('123e4567-e89b-12d3-a456-426614174001', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze');