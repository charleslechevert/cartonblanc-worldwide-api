-- Drop tables if they already exist
DROP TABLE IF EXISTS REGISTER;
DROP TABLE IF EXISTS PENALTY;
DROP TABLE IF EXISTS PLAYER;
DROP TABLE IF EXISTS TEAM;

-- Creating the 'TEAM' table
CREATE TABLE TEAM (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) UNIQUE NOT NULL,
  short_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  admin_password VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  objective TEXT,
  sentence TEXT,
  email_team VARCHAR(255),
  email_admin VARCHAR(255),
  color1 CHAR(7),
  color2 CHAR(7)
);

-- Adding email and color format checks
ALTER TABLE TEAM
ADD CONSTRAINT email_team_format_check CHECK (email_team ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
ADD CONSTRAINT email_admin_format_check CHECK (email_admin ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
ADD CONSTRAINT color1_format_check CHECK (color1 ~* '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'),
ADD CONSTRAINT color2_format_check CHECK (color2 ~* '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$');

-- Creating the 'PLAYER' table
CREATE TABLE PLAYER (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  team_id INT,
  CONSTRAINT player_team_id_fkey FOREIGN KEY (team_id)
    REFERENCES TEAM (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT player_name_team_id_key UNIQUE (name, team_id)
);

-- Creating the 'PENALTY' table
CREATE TABLE PENALTY (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  price FLOAT NOT NULL,
  team_id INT,
  CONSTRAINT penalty_team_id_fkey FOREIGN KEY (team_id)
    REFERENCES TEAM (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT penalty_name_team_id_key UNIQUE (name, team_id)
);

-- Creating the 'REGISTER' table
CREATE TABLE REGISTER (
  id SERIAL PRIMARY KEY,
  date DATE,
  remaining_amount_to_pay FLOAT,
  descr TEXT,
  player_id INT,
  penalty_id INT,
  CONSTRAINT register_player_id_fkey FOREIGN KEY (player_id)
    REFERENCES PLAYER (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT register_penalty_id_fkey FOREIGN KEY (penalty_id)
    REFERENCES PENALTY (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
);
