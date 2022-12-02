const client = require("./db");

const seed = async (seedAll: boolean) => {
  let query = `
    INSERT INTO ranks VALUES ('1');
    INSERT INTO flights VALUES ('1');
    INSERT INTO cats VALUES ('1', false);
    INSERT INTO positions VALUES ('1', 'APP');
    INSERT INTO scenario_categories VALUES ('1');

    INSERT INTO users (id, username, password) VALUES ('a3bc9288-ef05-4873-be4c-4b35436f852e', '1', '1');

    INSERT INTO profiles (
      user_id, rank, full_name, id_number, date_of_birth, date_accepted, reporting_date, cat, flight
    )
    VALUES (
      'a3bc9288-ef05-4873-be4c-4b35436f852e',
      '2LT',
      '1',
      '123456789',
      1,
      1,
      1,
      'A',
      'HQ'
    );

    INSERT INTO user_positions (id, user_id, position, start_date, end_date, approval_date)
    VALUES (
      'a3bc9288-ef05-4873-be4c-4b35436f852e',
      'a3bc9288-ef05-4873-be4c-4b35436f852e',
      'ARR',
      1,
      1,
      1
    );

    INSERT INTO assessments (id, user_position_id, assessment_number, instructor, date, intensity, objective1, a, b, c, d, e, f, g, h, I, j, safety, remarks, is_simulator)
    VALUES (
      'a3bc9288-ef05-4873-be4c-4b35436f852e',
      'a3bc9288-ef05-4873-be4c-4b35436f852e',
      1,
      '1',
      1,
      1,
      '1',
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      true,
      '1',
      false
    );

    INSERT INTO scenarios (id, position, scenario_number, scenario_category, first_position_requirement, subsequent_position_requirement, revalidation_requirement)
    VALUES (
      'a3bc9288-ef05-4873-be4c-4b35436f852e',
      'ARR',
      1,
      'BEGINNER',
      1,
      1,
      1
    );

    INSERT INTO scenario_requirements (id, user_position_id, scenario_id, requirement, fulfilled)
    VALUES (
      'a3bc9288-ef05-4873-be4c-4b35436f852e',
      'a3bc9288-ef05-4873-be4c-4b35436f852e',
      'a3bc9288-ef05-4873-be4c-4b35436f852e',
      1,
      1
    );

    INSERT INTO assessment_scenarios (id, assessment_id, scenario_id)
    VALUES (
      'a3bc9288-ef05-4873-be4c-4b35436f852e',
      'a3bc9288-ef05-4873-be4c-4b35436f852e',
      'a3bc9288-ef05-4873-be4c-4b35436f852e'
    );

    INSERT INTO tokens (id, type, parent_id) VALUES ('a3bc9288-ef05-4873-be4c-4b35436f852e', '1', 'a3bc9288-ef05-4873-be4c-4b35436f852e');

    DELETE FROM tokens WHERE id = 'a3bc9288-ef05-4873-be4c-4b35436f852e' AND type = '1' AND parent_id = 'a3bc9288-ef05-4873-be4c-4b35436f852e';
    DELETE FROM assessment_scenarios WHERE id = 'a3bc9288-ef05-4873-be4c-4b35436f852e';
    DELETE FROM scenario_requirements WHERE id = 'a3bc9288-ef05-4873-be4c-4b35436f852e';
    DELETE FROM scenarios WHERE id = 'a3bc9288-ef05-4873-be4c-4b35436f852e';
    DELETE FROM assessments WHERE id = 'a3bc9288-ef05-4873-be4c-4b35436f852e';
    DELETE FROM user_positions WHERE id = 'a3bc9288-ef05-4873-be4c-4b35436f852e';
    DELETE FROM profiles WHERE user_id = 'a3bc9288-ef05-4873-be4c-4b35436f852e';
    DELETE FROM users WHERE username = '1';
    DELETE FROM scenario_categories WHERE scenario_category = '1';
    DELETE FROM positions WHERE position = '1';
    DELETE FROM cats WHERE cat = '1';
    DELETE FROM flights WHERE flight = '1';
    DELETE FROM ranks WHERE rank = '1';
  `;
  await client.query(query, async (err: Error, res: any) => {
    if (!err) {
      console.log("Tables already exist");
      return;
    }
    console.log(err);

    // Set up of tables
    await client.query(
      `
      BEGIN;
          CREATE TABLE IF NOT EXISTS users (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4() UNIQUE,
            username varchar(20) NOT NULL UNIQUE,
            password varchar(60) NOT NULL,
            is_admin boolean NOT NULL DEFAULT false
          );
      
          CREATE TABLE IF NOT EXISTS positions (
            position varchar(30) NOT NULL PRIMARY KEY UNIQUE,
            category varchar(4) NOT NULL
          );
          CREATE TABLE IF NOT EXISTS ranks (
            rank varchar(4) NOT NULL PRIMARY KEY UNIQUE
          );
          CREATE TABLE IF NOT EXISTS cats (
            cat varchar(5) NOT NULL PRIMARY KEY UNIQUE,
            is_upgrade boolean NOT NULL
          );
          CREATE TABLE IF NOT EXISTS flights (
            flight varchar(15) NOT NULL PRIMARY KEY UNIQUE
          );
          CREATE TABLE IF NOT EXISTS scenario_categories (
            scenario_category varchar(15) NOT NULL PRIMARY KEY UNIQUE
          );
      
          CREATE TABLE IF NOT EXISTS profiles (
            user_id uuid PRIMARY KEY UNIQUE,
            rank varchar(4),
            full_name varchar(50) NOT NULL,
            id_number varchar(9) NOT NULL,
            date_of_birth int NOT NULL,
            date_accepted int NOT NULL,
            reporting_date int NOT NULL,
            cat varchar(5),
            flight varchar(15),
            CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users (id),
            CONSTRAINT FK_rank FOREIGN KEY (rank) REFERENCES ranks (rank) ON UPDATE CASCADE,
            CONSTRAINT FK_cat FOREIGN KEY (cat) REFERENCES cats (cat) ON UPDATE CASCADE,
            CONSTRAINT FK_flight FOREIGN KEY (flight) REFERENCES flights (flight) ON UPDATE CASCADE
          );
      
          CREATE TABLE IF NOT EXISTS user_positions (
            id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
            user_id uuid NOT NULL,
            position varchar(30),
            start_date int NOT NULL,
            end_date int,
            approval_date int,
            is_revalidation boolean NOT NULL DEFAULT false,
            is_instructor boolean NOT NULL DEFAULT false,
            cat_upgrade varchar(5),
            CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users (id),
            CONSTRAINT FK_position FOREIGN KEY (position) REFERENCES positions (position) ON UPDATE CASCADE,
            CONSTRAINT FK_cat_upgrade FOREIGN KEY (cat_upgrade) REFERENCES cats (cat) ON UPDATE CASCADE
          );
      
          CREATE TABLE IF NOT EXISTS assessments (
            id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
            user_position_id uuid NOT NULL,
            assessment_number smallint NOT NULL,
            instructor varchar(50) NOT NULL,
            date int NOT NULL,
            intensity smallint NOT NULL,
            objective1 text NOT NULL,
            objective2 text,
            objective3 text,
            a smallint NOT NULL,
            b smallint NOT NULL,
            c smallint NOT NULL,
            d smallint NOT NULL,
            e smallint NOT NULL,
            f smallint NOT NULL,
            g smallint NOT NULL,
            h smallint NOT NULL,
            i smallint NOT NULL,
            j smallint NOT NULL,
            safety boolean NOT NULL,
            grade smallint GENERATED ALWAYS AS (a + b + c + d + e + f + g + h + i + j) STORED,
            remarks text NOT NULL,
            is_simulator boolean NOT NULL,
            CONSTRAINT FK_user_position_id FOREIGN KEY (user_position_id) REFERENCES user_positions (id),
            CONSTRAINT CHK_grades CHECK (
              a > 0 AND a <= 10 AND
              b > 0 AND b <= 10 AND
              c > 0 AND c <= 10 AND
              d > 0 AND d <= 10 AND
              e > 0 AND e <= 10 AND
              f > 0 AND f <= 10 AND
              g > 0 AND g <= 10 AND
              h > 0 AND h <= 10 AND
              i > 0 AND i <= 10 AND
              j > 0 AND j <= 10 AND
              grade > 0 AND grade <= 100
            )
          );

          CREATE TABLE IF NOT EXISTS scenarios (
            id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
            position varchar(30),
            scenario_number smallint NOT NULL,
            scenario_category varchar(15) NOT NULL,
            first_position_requirement smallint NOT NULL,
            subsequent_position_requirement smallint NOT NULL,
            revalidation_requirement smallint NOT NULL,
            first_position_live_requirement smallint,
            subsequent_position_live_requirement smallint,
            revalidation_live_requirement smallint,
            CONSTRAINT FK_position FOREIGN KEY (position) REFERENCES positions (position) ON UPDATE CASCADE,
            CONSTRAINT FK_scenario_category FOREIGN KEY (scenario_category) REFERENCES scenario_categories (scenario_category) ON UPDATE CASCADE
          );

          CREATE TABLE IF NOT EXISTS scenario_requirements (
            id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
            user_position_id uuid NOT NULL,
            scenario_id uuid NOT NULL,
            requirement smallint NOT NULL,
            fulfilled smallint NOT NULL,
            live_requirement smallint,
            live_fulfilled smallint,
            CONSTRAINT FK_user_position_id FOREIGN KEY (user_position_id) REFERENCES user_positions (id),
            CONSTRAINT FK_scenario_id FOREIGN KEY (scenario_id) REFERENCES scenarios (id)
          );

          CREATE TABLE IF NOT EXISTS assessment_scenarios (
            id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
            assessment_id uuid NOT NULL,
            scenario_id uuid NOT NULL,
            CONSTRAINT FK_assessment_id FOREIGN KEY (assessment_id) REFERENCES assessments (id),
            CONSTRAINT FK_scenario_id FOREIGN KEY (scenario_id) REFERENCES scenarios (id)
          );
      
          CREATE TABLE IF NOT EXISTS tokens (
            id uuid PRIMARY KEY UNIQUE,
            type varchar(7) NOT NULL,
            parent_id uuid
          );
  
      COMMIT;
  
      INSERT INTO tokens (id, type, parent_id) VALUES ('a3bc9288-ef05-4873-be4c-4b35436f852e', '1', 'a3bc9288-ef05-4873-be4c-4b35436f852e');
      DELETE FROM tokens WHERE id = 'a3bc9288-ef05-4873-be4c-4b35436f852e' AND type = '1' AND parent_id = 'a3bc9288-ef05-4873-be4c-4b35436f852e';
      `,
      async (err: Error, res: any) => {
        if (err) {
          await client.query("ROLLBACK;");
          throw err;
        }
        console.log("Tables Created");
      }
    );

    // Insert default values for ranks, cats, flights, positions
    await client.query(
      `
      BEGIN;
          INSERT INTO ranks (rank) VALUES ('2LT');
          INSERT INTO ranks (rank) VALUES ('LTA');
          INSERT INTO ranks (rank) VALUES ('CPT');
          INSERT INTO ranks (rank) VALUES ('MAJ');
          INSERT INTO ranks (rank) VALUES ('LTC');
          INSERT INTO ranks (rank) VALUES ('SLTC');
          INSERT INTO ranks (rank) VALUES ('COL');
          INSERT INTO ranks (rank) VALUES ('BG');
          INSERT INTO ranks (rank) VALUES ('MG');
          INSERT INTO ranks (rank) VALUES ('LG');
          INSERT INTO cats (cat, is_upgrade) VALUES ('A', true);
          INSERT INTO cats (cat, is_upgrade) VALUES ('B', true);
          INSERT INTO cats (cat, is_upgrade) VALUES ('C', true);
          INSERT INTO cats (cat, is_upgrade) VALUES ('D', false);
          INSERT INTO cats (cat, is_upgrade) VALUES ('CNX', true);
          INSERT INTO flights (flight) VALUES ('HQ');
          INSERT INTO flights (flight) VALUES ('S3');
          INSERT INTO flights (flight) VALUES ('APP');
          INSERT INTO flights (flight) VALUES ('AREA');
          INSERT INTO flights (flight) VALUES ('OPS HUB');
          INSERT INTO flights (flight) VALUES ('PARTICIPATION');
          INSERT INTO flights (flight) VALUES ('TRAINING');
          INSERT INTO flights (flight) VALUES ('CMS');
          INSERT INTO positions (position, category) VALUES ('CNX', 'CNX');
          INSERT INTO positions (position, category) VALUES ('FIS', 'SUP');
          INSERT INTO positions (position, category) VALUES ('DEP', 'AREA');
          INSERT INTO positions (position, category) VALUES ('ARR', 'AREA');
          INSERT INTO positions (position, category) VALUES ('TAP', 'APP');
          INSERT INTO positions (position, category) VALUES ('TAC', 'SUP');
          INSERT INTO positions (position, category) VALUES ('PAP', 'APP');
          INSERT INTO positions (position, category) VALUES ('PAC', 'SUP');
          INSERT INTO positions (position, category) VALUES ('ISL', 'APP');
          INSERT INTO scenario_categories (scenario_category) VALUES ('BEGINNER');
          INSERT INTO scenario_categories (scenario_category) VALUES ('INTERMEDIATE');
          INSERT INTO scenario_categories (scenario_category) VALUES ('ADVANCED');
      COMMIT;
    `,
      async (err: Error, res: any) => {
        if (err) {
          await client.query("ROLLBACK;");
          throw err;
        }
        console.log("Inserted Enums");
      }
    );

    if (!seedAll) {
      console.log("Tables Only - Seeding Completed");
      return;
    }

    // Insert seed
    await client.query(
      `
      BEGIN;
          -- Insert Users
          INSERT INTO users (username, password, is_admin)
          VALUES
          ('admin', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', true),
          ('instructor', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('alpha', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('bravo', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('charlie', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('delta', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('echo', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('foxtrot', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('golf', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('hotel', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('india', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('juliet', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('kilo', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('lima', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('mike', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false),
          ('november', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', false);

          -- Insert Profiles
          INSERT INTO profiles (user_id, rank, full_name, id_number, date_of_birth, date_accepted, reporting_date, cat, flight)
          VALUES
          ((SELECT id FROM users WHERE username = 'admin'), 'CPT', 'admin', '123456789', 800553600, 1368633600, 1381852800, 'A', 'HQ'),
          ((SELECT id FROM users WHERE username = 'instructor'), 'CPT', 'instructor', '123456789', 800553600, 1368633600, 1381852800, 'A', 'HQ'),
          ((SELECT id FROM users WHERE username = 'alpha'), '2LT', 'alpha', '123456789', 800553600, 1368633600, 1381852800, 'D', 'HQ'),
          ((SELECT id FROM users WHERE username = 'bravo'), '2LT', 'bravo', '123456789', 800553600, 1368633600, 1381852800, 'D', 'HQ'),
          ((SELECT id FROM users WHERE username = 'charlie'), '2LT', 'charlie', '123456789', 800553600, 1368633600, 1381852800, 'D', 'HQ'),
          ((SELECT id FROM users WHERE username = 'delta'), '2LT', 'delta', '123456789', 800553600, 1368633600, 1381852800, 'D', 'HQ'),
          ((SELECT id FROM users WHERE username = 'echo'), '2LT', 'echo', '123456789', 800553600, 1368633600, 1381852800, 'D', 'HQ'),
          ((SELECT id FROM users WHERE username = 'foxtrot'), '2LT', 'foxtrot', '123456789', 800553600, 1368633600, 1381852800, 'D', 'HQ'),
          ((SELECT id FROM users WHERE username = 'golf'), '2LT', 'golf', '123456789', 800553600, 1368633600, 1381852800, 'D', 'HQ'),
          ((SELECT id FROM users WHERE username = 'hotel'), '2LT', 'hotel', '123456789', 800553600, 1368633600, 1381852800, 'C', 'HQ'),
          ((SELECT id FROM users WHERE username = 'india'), '2LT', 'india', '123456789', 800553600, 1368633600, 1381852800, 'C', 'HQ'),
          ((SELECT id FROM users WHERE username = 'juliet'), '2LT', 'juliet', '123456789', 800553600, 1368633600, 1381852800, 'C', 'HQ'),
          ((SELECT id FROM users WHERE username = 'kilo'), '2LT', 'kilo', '123456789', 800553600, 1368633600, 1381852800, 'C', 'HQ'),
          ((SELECT id FROM users WHERE username = 'lima'), '2LT', 'lima', '123456789', 800553600, 1368633600, 1381852800, 'B', 'HQ'),
          ((SELECT id FROM users WHERE username = 'mike'), '2LT', 'mike', '123456789', 800553600, 1368633600, 1381852800, 'B', 'HQ'),
          ((SELECT id FROM users WHERE username = 'november'), '2LT', 'november', '123456789', 800553600, 1368633600, 1381852800, 'B', 'HQ');

          -- Insert Positions
          INSERT INTO user_positions (user_id, position, start_date, end_date, approval_date, is_revalidation, is_instructor, cat_upgrade)
          VALUES
          ((SELECT id FROM users WHERE username = 'admin'), 'DEP', 1400169600, 1419436800, 1419955200, true, true, 'C'),
          ((SELECT id FROM users WHERE username = 'admin'), 'ISL', 1400169600, 1419436800, null, false, false, 'B'),
          ((SELECT id FROM users WHERE username = 'admin'), 'FIS', 1400169600, null, null, false, false, 'A'),
          ((SELECT id FROM users WHERE username = 'instructor'), 'PAP', 1400169600, 1419436800, 1419955200, false, true, 'C'),
          ((SELECT id FROM users WHERE username = 'instructor'), 'DEP', 1400169600, 1419436800, 1419955200, false, true, 'B'),
          ((SELECT id FROM users WHERE username = 'instructor'), 'ISL', 1400169600, 1419436800, 1419955200, false, true, null),
          ((SELECT id FROM users WHERE username = 'instructor'), 'PAC', 1400169600, 1419436800, 1419955200, false, true, 'A'),
          ((SELECT id FROM users WHERE username = 'instructor'), 'TAP', 1400169600, 1419436800, 1419955200, false, true, null),
          ((SELECT id FROM users WHERE username = 'instructor'), 'ARR', 1400169600, 1419436800, 1419955200, false, true, null),
          ((SELECT id FROM users WHERE username = 'instructor'), 'TAC', 1400169600, 1419436800, 1419955200, false, true, null),
          ((SELECT id FROM users WHERE username = 'instructor'), 'FIS', 1400169600, 1419436800, 1419955200, false, true, null),
          ((SELECT id FROM users WHERE username = 'alpha'), 'DEP', 1400169600, null, null, false, false, 'C'),
          ((SELECT id FROM users WHERE username = 'bravo'), 'DEP', 1400169600, null, null, false, false, 'C'),
          ((SELECT id FROM users WHERE username = 'charlie'), 'ARR', 1400169600, null, null, false, false, 'C'),
          ((SELECT id FROM users WHERE username = 'delta'), 'ARR', 1400169600, null, null, false, false, 'C'),
          ((SELECT id FROM users WHERE username = 'echo'), 'PAP', 1400169600, null, null, false, false, 'C'),
          ((SELECT id FROM users WHERE username = 'foxtrot'), 'PAP', 1400169600, null, null, false, false, 'C'),
          ((SELECT id FROM users WHERE username = 'golf'), 'TAP', 1400169600, null, null, false, false, 'C'),
          ((SELECT id FROM users WHERE username = 'hotel'), 'TAP', 1400169600, null, null, false, false, 'B'),
          ((SELECT id FROM users WHERE username = 'india'), 'PAP', 1400169600, null, null, false, false, 'B'),
          ((SELECT id FROM users WHERE username = 'juliet'), 'ARR', 1400169600, null, null, false, false, 'B'),
          ((SELECT id FROM users WHERE username = 'kilo'), 'DEP', 1400169600, null, null, false, false, 'B'),
          ((SELECT id FROM users WHERE username = 'lima'), 'TAC', 1400169600, null, null, false, false, 'A'),
          ((SELECT id FROM users WHERE username = 'mike'), 'PAC', 1400169600, null, null, false, false, 'A'), ((SELECT id FROM users WHERE username = 'november'), 'FIS', 1400169600, null, null, false, false, 'A');
  
          -- Insert Assessments
          INSERT INTO assessments (user_position_id, assessment_number, instructor, date, intensity, objective1, a, b, c, d, e, f, g, h, I, j, safety, remarks, is_simulator)
          VALUES
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 1, 'watson toh', 1400169600, 4, 'train', 4, 9, 5, 5, 9, 4, 3, 5, 4, 9, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 2, 'watson toh', 1400169600, 4, 'train', 1, 6, 4, 5, 4, 8, 1, 5, 8, 9, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 3, 'watson toh', 1400169600, 4, 'train', 7, 6, 7, 6, 7, 3, 4, 10, 8, 1, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 4, 'watson toh', 1400169600, 4, 'train', 10, 8, 1, 8, 8, 4, 5, 6, 5, 3, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 5, 'watson toh', 1400169600, 4, 'train', 4, 5, 3, 10, 5, 6, 2, 6, 4, 9, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 6, 'watson toh', 1400169600, 4, 'train', 4, 2, 3, 10, 10, 9, 6, 7, 4, 3, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 7, 'watson toh', 1400169600, 4, 'train', 6, 1, 4, 10, 10, 6, 6, 2, 3, 4, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 8, 'watson toh', 1400169600, 4, 'train', 3, 10, 5, 6, 10, 5, 7, 10, 2, 8, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 9, 'watson toh', 1400169600, 4, 'train', 10, 1, 2, 10, 1, 6, 7, 3, 7, 8, false, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 10, 'watson toh', 1400169600, 4, 'train', 1, 5, 5, 8, 7, 6, 2, 8, 5, 8, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 11, 'watson toh', 1400169600, 4, 'train', 9, 3, 3, 10, 10, 5, 7, 6, 3, 6, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 12, 'watson toh', 1400169600, 4, 'train', 2, 10, 5, 10, 5, 6, 6, 3, 3, 1, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 13, 'watson toh', 1400169600, 4, 'train', 3, 7, 5, 3, 10, 2, 6, 8, 6, 9, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 14, 'watson toh', 1400169600, 4, 'train', 9, 9, 1, 7, 1, 2, 10, 4, 9, 7, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 15, 'watson toh', 1400169600, 4, 'train', 4, 9, 7, 9, 5, 7, 2, 3, 2, 1, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 16, 'watson toh', 1400169600, 4, 'train', 5, 2, 1, 2, 8, 6, 4, 4, 3, 3, true, 'bad', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 17, 'watson toh', 1400169600, 4, 'train', 6, 6, 10, 10, 1, 4, 8, 10, 3, 4, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 18, 'watson toh', 1400169600, 4, 'train', 9, 1, 7, 4, 10, 1, 3, 8, 9, 1, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 19, 'watson toh', 1400169600, 4, 'train', 10, 2, 4, 3, 3, 7, 5, 8, 10, 5, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 20, 'watson toh', 1400169600, 4, 'train', 8, 7, 9, 1, 3, 7, 8, 1, 6, 4, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 21, 'watson toh', 1400169600, 4, 'train', 5, 1, 5, 6, 7, 9, 5, 10, 8, 9, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 22, 'watson toh', 1400169600, 4, 'train', 9, 1, 7, 8, 7, 10, 7, 3, 5, 3, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 23, 'watson toh', 1400169600, 4, 'train', 10, 2, 6, 5, 9, 3, 10, 3, 3, 6, false, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 24, 'watson toh', 1400169600, 4, 'train', 4, 9, 3, 10, 7, 5, 9, 1, 3, 1, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 25, 'watson toh', 1400169600, 4, 'train', 4, 5, 10, 9, 8, 4, 8, 6, 4, 2, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 26, 'watson toh', 1400169600, 4, 'train', 5, 5, 1, 1, 10, 3, 5, 3, 8, 2, true, 'bad', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 27, 'watson toh', 1400169600, 4, 'train', 6, 5, 2, 5, 7, 4, 5, 2, 10, 3, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 28, 'watson toh', 1400169600, 4, 'train', 1, 3, 6, 3, 6, 6, 9, 2, 2, 8, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 29, 'watson toh', 1400169600, 4, 'train', 4, 5, 7, 10, 4, 6, 9, 1, 8, 5, false, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 30, 'watson toh', 1400169600, 4, 'train', 3, 5, 5, 10, 9, 4, 10, 7, 5, 8, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 31, 'watson toh', 1400169600, 4, 'train', 6, 6, 8, 5, 1, 10, 4, 1, 8, 4, false, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 32, 'watson toh', 1400169600, 4, 'train', 5, 8, 5, 7, 6, 2, 8, 3, 9, 7, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 33, 'watson toh', 1400169600, 4, 'train', 10, 4, 1, 9, 3, 8, 6, 4, 10, 4, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 34, 'watson toh', 1400169600, 4, 'train', 5, 5, 1, 9, 6, 2, 10, 1, 6, 4, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 35, 'watson toh', 1400169600, 4, 'train', 3, 3, 6, 10, 2, 4, 7, 9, 4, 7, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 36, 'watson toh', 1400169600, 4, 'train', 8, 3, 4, 6, 6, 9, 4, 8, 6, 4, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 37, 'watson toh', 1400169600, 4, 'train', 8, 5, 5, 10, 5, 7, 10, 4, 5, 5, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 38, 'watson toh', 1400169600, 4, 'train', 7, 6, 4, 10, 5, 4, 8, 2, 5, 5, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 39, 'watson toh', 1400169600, 4, 'train', 8, 3, 7, 2, 8, 1, 3, 2, 8, 7, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 40, 'watson toh', 1400169600, 4, 'train', 7, 5, 1, 5, 1, 5, 10, 9, 10, 6, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 41, 'watson toh', 1400169600, 4, 'train', 7, 3, 10, 10, 3, 6, 6, 1, 6, 3, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 42, 'watson toh', 1400169600, 4, 'train', 5, 6, 7, 8, 4, 6, 2, 10, 9, 8, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 43, 'watson toh', 1400169600, 4, 'train', 3, 7, 1, 10, 4, 2, 1, 10, 1, 6, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 44, 'watson toh', 1400169600, 4, 'train', 3, 6, 6, 6, 7, 5, 10, 4, 2, 7, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 45, 'watson toh', 1400169600, 4, 'train', 6, 3, 4, 10, 4, 4, 7, 8, 10, 8, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 46, 'watson toh', 1400169600, 4, 'train', 5, 3, 6, 2, 4, 1, 10, 5, 3, 6, false, 'bad', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 47, 'watson toh', 1400169600, 4, 'train', 2, 9, 6, 7, 2, 5, 4, 10, 6, 3, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 48, 'watson toh', 1400169600, 4, 'train', 2, 4, 8, 3, 6, 6, 5, 9, 2, 5, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 49, 'watson toh', 1400169600, 4, 'train', 6, 7, 10, 7, 6, 5, 2, 8, 8, 9, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'), 50, 'watson toh', 1400169600, 4, 'train', 4, 8, 9, 8, 1, 1, 3, 2, 5, 4, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 1, 'watson toh', 1400169600, 4, 'train', 7, 7, 3, 2, 10, 10, 1, 2, 1, 1, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 2, 'watson toh', 1400169600, 4, 'train', 9, 5, 10, 9, 10, 4, 3, 4, 10, 6, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 3, 'watson toh', 1400169600, 4, 'train', 6, 3, 4, 7, 3, 5, 7, 5, 4, 5, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 4, 'watson toh', 1400169600, 4, 'train', 4, 9, 1, 10, 1, 7, 3, 3, 4, 8, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 5, 'watson toh', 1400169600, 4, 'train', 3, 8, 4, 2, 1, 9, 9, 7, 10, 4, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 6, 'watson toh', 1400169600, 4, 'train', 4, 9, 2, 8, 7, 2, 5, 1, 7, 9, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 7, 'watson toh', 1400169600, 4, 'train', 3, 4, 10, 5, 3, 8, 7, 2, 7, 5, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 8, 'watson toh', 1400169600, 4, 'train', 6, 9, 10, 1, 1, 3, 4, 4, 8, 2, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 9, 'watson toh', 1400169600, 4, 'train', 10, 3, 10, 8, 9, 1, 4, 5, 10, 3, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 10, 'watson toh', 1400169600, 4, 'train', 3, 6, 8, 2, 10, 6, 7, 7, 1, 2, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 11, 'watson toh', 1400169600, 4, 'train', 9, 10, 6, 4, 3, 1, 3, 6, 1, 5, false, 'bad', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 12, 'watson toh', 1400169600, 4, 'train', 1, 6, 4, 6, 10, 8, 7, 4, 8, 6, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 13, 'watson toh', 1400169600, 4, 'train', 9, 2, 1, 10, 8, 2, 6, 3, 9, 7, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 14, 'watson toh', 1400169600, 4, 'train', 5, 7, 4, 2, 1, 4, 9, 3, 5, 7, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 15, 'watson toh', 1400169600, 4, 'train', 6, 8, 7, 5, 2, 1, 8, 10, 9, 6, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 16, 'watson toh', 1400169600, 4, 'train', 6, 9, 4, 1, 9, 6, 10, 4, 2, 9, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 17, 'watson toh', 1400169600, 4, 'train', 7, 2, 7, 4, 10, 9, 9, 5, 2, 8, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 18, 'watson toh', 1400169600, 4, 'train', 5, 1, 1, 1, 2, 8, 8, 9, 4, 6, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 19, 'watson toh', 1400169600, 4, 'train', 2, 1, 1, 3, 8, 1, 7, 3, 3, 8, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 20, 'watson toh', 1400169600, 4, 'train', 5, 8, 4, 3, 2, 3, 2, 4, 7, 4, true, 'bad', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 21, 'watson toh', 1400169600, 4, 'train', 8, 8, 5, 7, 1, 9, 10, 10, 1, 9, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 22, 'watson toh', 1400169600, 4, 'train', 9, 3, 8, 4, 10, 2, 5, 2, 6, 9, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 23, 'watson toh', 1400169600, 4, 'train', 6, 1, 3, 8, 1, 6, 1, 2, 2, 1, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 24, 'watson toh', 1400169600, 4, 'train', 10, 10, 8, 6, 7, 6, 10, 4, 4, 9, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 25, 'watson toh', 1400169600, 4, 'train', 3, 6, 10, 3, 4, 4, 7, 3, 8, 1, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 26, 'watson toh', 1400169600, 4, 'train', 10, 3, 3, 10, 3, 1, 8, 1, 2, 5, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 27, 'watson toh', 1400169600, 4, 'train', 3, 6, 3, 9, 4, 9, 10, 2, 4, 7, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 28, 'watson toh', 1400169600, 4, 'train', 10, 9, 5, 7, 3, 3, 4, 4, 9, 9, false, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 29, 'watson toh', 1400169600, 4, 'train', 5, 7, 7, 9, 5, 9, 2, 6, 1, 10, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 30, 'watson toh', 1400169600, 4, 'train', 6, 10, 8, 7, 2, 10, 6, 6, 8, 7, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 31, 'watson toh', 1400169600, 4, 'train', 2, 9, 6, 10, 9, 7, 3, 4, 3, 8, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 32, 'watson toh', 1400169600, 4, 'train', 9, 4, 9, 6, 7, 7, 10, 8, 8, 3, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 33, 'watson toh', 1400169600, 4, 'train', 10, 3, 2, 6, 4, 6, 3, 7, 1, 6, true, 'bad', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 34, 'watson toh', 1400169600, 4, 'train', 6, 2, 10, 7, 6, 2, 5, 2, 6, 10, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 35, 'watson toh', 1400169600, 4, 'train', 6, 4, 7, 4, 5, 9, 2, 3, 9, 7, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 36, 'watson toh', 1400169600, 4, 'train', 10, 10, 3, 7, 4, 3, 3, 1, 6, 3, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 37, 'watson toh', 1400169600, 4, 'train', 3, 4, 8, 4, 5, 5, 6, 5, 8, 3, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 38, 'watson toh', 1400169600, 4, 'train', 9, 9, 10, 8, 2, 9, 9, 2, 8, 3, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 39, 'watson toh', 1400169600, 4, 'train', 1, 3, 8, 3, 4, 8, 4, 6, 4, 2, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'), 40, 'watson toh', 1400169600, 4, 'train', 3, 10, 9, 6, 10, 6, 8, 2, 2, 5, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 1, 'watson toh', 1400169600, 4, 'train', 7, 3, 4, 5, 10, 8, 7, 7, 3, 7, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 2, 'watson toh', 1400169600, 4, 'train', 3, 8, 10, 4, 6, 10, 5, 2, 3, 5, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 3, 'watson toh', 1400169600, 4, 'train', 6, 5, 2, 8, 2, 10, 3, 5, 7, 5, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 4, 'watson toh', 1400169600, 4, 'train', 9, 4, 3, 10, 2, 5, 8, 2, 10, 9, false, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 5, 'watson toh', 1400169600, 4, 'train', 1, 1, 1, 9, 7, 10, 6, 1, 8, 1, true, 'bad', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 6, 'watson toh', 1400169600, 4, 'train', 8, 2, 1, 4, 2, 6, 10, 4, 10, 1, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 7, 'watson toh', 1400169600, 4, 'train', 1, 5, 1, 10, 5, 1, 8, 9, 5, 6, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 8, 'watson toh', 1400169600, 4, 'train', 3, 6, 8, 7, 2, 6, 10, 5, 8, 3, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 9, 'watson toh', 1400169600, 4, 'train', 6, 7, 4, 7, 3, 4, 1, 7, 1, 3, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 10, 'watson toh', 1400169600, 4, 'train', 4, 3, 4, 2, 3, 4, 9, 6, 6, 3, false, 'bad', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 11, 'watson toh', 1400169600, 4, 'train', 7, 9, 7, 5, 4, 5, 5, 4, 8, 8, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 12, 'watson toh', 1400169600, 4, 'train', 6, 1, 5, 9, 9, 7, 1, 4, 6, 8, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 13, 'watson toh', 1400169600, 4, 'train', 6, 1, 10, 6, 8, 1, 5, 4, 3, 6, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 14, 'watson toh', 1400169600, 4, 'train', 6, 6, 4, 8, 6, 5, 5, 9, 3, 1, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 15, 'watson toh', 1400169600, 4, 'train', 1, 2, 9, 7, 10, 2, 4, 1, 3, 5, true, 'bad', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 16, 'watson toh', 1400169600, 4, 'train', 1, 6, 5, 10, 9, 7, 9, 6, 3, 1, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 17, 'watson toh', 1400169600, 4, 'train', 5, 3, 4, 5, 5, 1, 4, 1, 6, 6, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 18, 'watson toh', 1400169600, 4, 'train', 2, 9, 10, 6, 2, 2, 1, 10, 3, 5, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 19, 'watson toh', 1400169600, 4, 'train', 2, 1, 2, 5, 7, 9, 9, 1, 6, 1, true, 'bad', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 20, 'watson toh', 1400169600, 4, 'train', 7, 3, 3, 4, 7, 4, 6, 5, 10, 8, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 21, 'watson toh', 1400169600, 4, 'train', 7, 3, 9, 1, 5, 6, 7, 3, 3, 1, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 22, 'watson toh', 1400169600, 4, 'train', 3, 1, 7, 1, 5, 4, 3, 3, 1, 7, true, 'bad', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 23, 'watson toh', 1400169600, 4, 'train', 9, 4, 3, 10, 10, 4, 6, 3, 10, 7, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 24, 'watson toh', 1400169600, 4, 'train', 5, 1, 9, 4, 6, 5, 5, 5, 4, 3, true, 'bad', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 25, 'watson toh', 1400169600, 4, 'train', 1, 10, 8, 6, 7, 10, 3, 10, 4, 5, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 26, 'watson toh', 1400169600, 4, 'train', 10, 5, 9, 2, 6, 2, 4, 10, 5, 3, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 27, 'watson toh', 1400169600, 4, 'train', 2, 7, 7, 10, 6, 6, 2, 8, 10, 2, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 28, 'watson toh', 1400169600, 4, 'train', 4, 9, 3, 10, 5, 10, 10, 7, 4, 8, true, 'good', false),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 29, 'watson toh', 1400169600, 4, 'train', 2, 10, 9, 2, 9, 4, 6, 6, 8, 1, true, 'good', true),
          ((SELECT id FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'), 30, 'watson toh', 1400169600, 4, 'train', 4, 10, 6, 8, 1, 9, 9, 7, 3, 9, true, 'good', false);
    `,
      async (err: Error, res: any) => {
        if (err) {
          // await client.query("ROLLBACK;");
          throw err;
        }
        console.log("Inserted Seed");
      }
    );

    console.log("Seed All - Seeding Completed");
  });
};

export {};

module.exports = seed;
