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
          -- Insert User
          INSERT INTO users (username, password, is_admin) VALUES ('admin', '$2b$12$43OLPsbg2jkSzd5yKWQEnucV0rSN0Zsf2hozra7RWzuvGqn2zjyxa', true);
  
          -- Insert Profile
          INSERT INTO profiles (
            user_id, rank, full_name, id_number, date_of_birth, date_accepted, reporting_date, cat, flight
          )
          VALUES (
            (SELECT id FROM users WHERE username = 'admin'),
            'CPT',
            'John Doe',
            '123456789',
            800553600,
            1368633600,
            1381852800,
            'B',
            'S3'
          );
  
          -- Insert Positions
          INSERT INTO user_positions (user_id, position, start_date, end_date, approval_date, is_revalidation, is_instructor, cat_upgrade)
          VALUES (
            (SELECT id FROM users WHERE username = 'admin'),
            'DEP',
            1400169600,
            1419436800,
            1419955200,
            true,
            true,
            'C'
          );
  
          INSERT INTO user_positions (user_id, position, start_date, end_date, cat_upgrade)
          VALUES (
            (SELECT id FROM users WHERE username = 'admin'),
            'ISL',
            1423065600,
            1444924800,
            'B'
          );
  
          INSERT INTO user_positions (user_id, position, start_date, cat_upgrade)
          VALUES (
            (SELECT id FROM users WHERE username = 'admin'),
            'FIS',
            1452009600,
            'A'
          );
  
          -- Insert DEP Assessments
          INSERT INTO assessments (user_position_id, assessment_number, instructor, date, intensity, objective1, a, b, c, d, e, f, g, h, I, j, safety, remarks, is_simulator)
          VALUES (
            (SELECT id FROM user_positions WHERE user_id = (
              SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'
            ),
            1,
            'Jane Doe',
            1400169600,
            4,
            'To do it',
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            true,
            'Needs more training',
            false
          );
  
          INSERT INTO assessments (user_position_id, assessment_number, instructor, date, intensity, objective1, a, b, c, d, e, f, g, h, I, j, safety, remarks, is_simulator)
          VALUES (
            (SELECT id FROM user_positions WHERE user_id = (
              SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'
            ),
            2,
            'Jane Doe',
            1400169600,
            3,
            'To do it',
            5,
            6,
            5,
            6,
            5,
            4,
            4,
            5,
            7,
            5,
            true,
            'Needs more training',
            false
          );
  
          INSERT INTO assessments (user_position_id, assessment_number, instructor, date, intensity, objective1, a, b, c, d, e, f, g, h, I, j, safety, remarks, is_simulator)
          VALUES (
            (SELECT id FROM user_positions WHERE user_id = (
              SELECT id FROM users WHERE username = 'admin') AND position = 'DEP'
            ),
            3,
            'Jane Doe',
            1400169600,
            4,
            'To do it',
            5,
            4,
            5,
            4,
            5,
            4,
            4,
            5,
            5,
            5,
            false,
            'Needs more training',
            false
          );
  
          -- Insert ISL Assessments
          INSERT INTO assessments (user_position_id, assessment_number, instructor, date, intensity, objective1, a, b, c, d, e, f, g, h, I, j, safety, remarks, is_simulator)
          VALUES (
            (SELECT id FROM user_positions WHERE user_id = (
              SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'
            ),
            1,
            'Jane Doe',
            1423065600,
            4,
            'To do it',
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            true,
            'Needs more training',
            false
          );
  
          INSERT INTO assessments (user_position_id, assessment_number, instructor, date, intensity, objective1, a, b, c, d, e, f, g, h, I, j, safety, remarks, is_simulator)
          VALUES (
            (SELECT id FROM user_positions WHERE user_id = (
              SELECT id FROM users WHERE username = 'admin') AND position = 'ISL'
            ),
            2,
            'Jane Doe',
            1423065600,
            3,
            'To do it',
            5,
            6,
            5,
            6,
            5,
            4,
            4,
            5,
            7,
            5,
            true,
            'Needs more training',
            false
          );
  
          -- Insert FIS Assessments
          INSERT INTO assessments (user_position_id, assessment_number, instructor, date, intensity, objective1, a, b, c, d, e, f, g, h, I, j, safety, remarks, is_simulator)
          VALUES (
            (SELECT id FROM user_positions WHERE user_id = (
              SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'
            ),
            1,
            'Jane Doe',
            1452009600,
            4,
            'To do it',
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            true,
            'Needs more training',
            false
          );
  
          INSERT INTO assessments (user_position_id, assessment_number, instructor, date, intensity, objective1, a, b, c, d, e, f, g, h, I, j, safety, remarks, is_simulator)
          VALUES (
            (SELECT id FROM user_positions WHERE user_id = (
              SELECT id FROM users WHERE username = 'admin') AND position = 'FIS'
            ),
            2,
            'Jane Doe',
            1452009600,
            3,
            'To do it',
            5,
            6,
            5,
            6,
            5,
            4,
            4,
            5,
            7,
            5,
            true,
            'Last Seed Entry',
            false
          );
  
      COMMIT;
  
      SELECT id FROM assessments WHERE remarks = 'Last Seed Entry';
    `,
      async (err: Error, res: any) => {
        if (err) {
          await client.query("ROLLBACK;");
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
