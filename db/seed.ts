const client = require("./db");

const seed = async (seedAll: boolean) => {
  let query = `
    INSERT INTO ranks VALUES ('1');
    INSERT INTO flights VALUES ('1');
    INSERT INTO cats VALUES ('1');
    INSERT INTO positions VALUES ('1');

    INSERT INTO users (username, password) VALUES ('1', '1');

    INSERT INTO profiles (
      user_id, rank, full_name, id_number, date_of_birth, date_accepted, reporting_date, cat, flight
    )
    VALUES (
      (SELECT id FROM users WHERE username = '1' AND password = '1'),
      '2LT',
      '1',
      '123456789',
      1,
      1,
      1,
      'A',
      'HQ'
    );

    INSERT INTO user_positions (user_id, position, start_date, end_date, approval_date)
    VALUES (
      (SELECT id FROM users WHERE username = '1'),
      'ARR',
      1,
      1,
      1
    );

    INSERT INTO assessments (user_position_id, assessment_number, instructor, date, intensity, objective1, a, b, c, d, e, f, g, h, I, j, safety, remarks, is_simulator)
    VALUES (
      (SELECT id FROM user_positions WHERE user_id = (
        SELECT id FROM users WHERE username = '1') AND position = 'ARR'
      ),
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

    INSERT INTO tokens (token, type, parent_token) VALUES ('1', '1', '1');

    DELETE FROM tokens WHERE token = '1' AND type = '1' AND parent_token = '1';
    DELETE FROM assessments WHERE user_position_id = (
      SELECT id FROM user_positions WHERE user_id = (
        SELECT id FROM users WHERE username = '1') AND position = 'ARR'
    );
    DELETE FROM user_positions WHERE user_id = (SELECT id FROM users WHERE username = '1');
    DELETE FROM profiles WHERE USER_ID = (SELECT id FROM users WHERE username = '1');
    DELETE FROM users WHERE username = '1';
    DELETE FROM positions WHERE positions = '1';
    DELETE FROM cats WHERE cats = '1';
    DELETE FROM flights WHERE flights = '1';
    DELETE FROM ranks WHERE ranks = '1';
  `;
  await client.query(query, async (err: Error, res: any) => {
    if (!err) {
      console.log("Tables already exist");
      return;
    }

    // Set up of tables
    await client.query(
      `
      BEGIN;
          CREATE TABLE IF NOT EXISTS users (
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4() UNIQUE,
          username varchar(20) NOT NULL UNIQUE,
          password varchar(20) NOT NULL
          );
      
          CREATE TABLE IF NOT EXISTS positions (
          positions char(3) NOT NULL PRIMARY KEY UNIQUE
          );
          CREATE TABLE IF NOT EXISTS ranks (
          ranks varchar(4) NOT NULL PRIMARY KEY UNIQUE
          );
          CREATE TABLE IF NOT EXISTS cats (
          cats varchar(3) NOT NULL PRIMARY KEY UNIQUE
          );
          CREATE TABLE IF NOT EXISTS flights (
          flights varchar(15) NOT NULL PRIMARY KEY UNIQUE
          );
      
          CREATE TABLE IF NOT EXISTS profiles (
          user_id uuid PRIMARY KEY UNIQUE,
          rank varchar(4) NOT NULL,
          full_name varchar(50) NOT NULL,
          id_number varchar(9) NOT NULL,
          date_of_birth int NOT NULL,
          date_accepted int NOT NULL,
          reporting_date int NOT NULL,
          cat varchar(3) NOT NULL,
          flight varchar(15) NOT NULL,
          CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users (id),
          CONSTRAINT FK_rank FOREIGN KEY (rank) REFERENCES ranks (ranks),
          CONSTRAINT FK_cat FOREIGN KEY (cat) REFERENCES cats (cats),
          CONSTRAINT FK_flight FOREIGN KEY (flight) REFERENCES flights (flights)
          );
      
          CREATE TABLE IF NOT EXISTS user_positions (
          id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
          user_id uuid NOT NULL,
          position char(3) NOT NULL,
          start_date int NOT NULL,
          end_date int,
          approval_date int,
          is_revalidation boolean NOT NULL DEFAULT false,
          is_instructor boolean NOT NULL DEFAULT false,
          CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users (id),
          CONSTRAINT FK_position FOREIGN KEY (position) REFERENCES positions (positions)
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
      
          CREATE TABLE IF NOT EXISTS tokens (
          id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
          token varchar(50) NOT NULL,
          type varchar(7) NOT NULL,
          parent_token varchar(50)
          );
  
      COMMIT;
  
      INSERT INTO tokens (token, type, parent_token) VALUES ('1', '1', '1');
      DELETE FROM tokens WHERE token = '1' AND type = '1' AND parent_token = '1';
      `,
      (err: Error, res: any) => {
        if (err) throw err;
        console.log("Tables Created");
      }
    );

    // Insert default values for ranks, cats, flights, positions
    await client.query(
      `
      BEGIN;
          INSERT INTO ranks (ranks) VALUES ('2LT');
          INSERT INTO ranks (ranks) VALUES ('LTA');
          INSERT INTO ranks (ranks) VALUES ('CPT');
          INSERT INTO ranks (ranks) VALUES ('MAJ');
          INSERT INTO ranks (ranks) VALUES ('LTC');
          INSERT INTO ranks (ranks) VALUES ('SLTC');
          INSERT INTO ranks (ranks) VALUES ('COL');
          INSERT INTO ranks (ranks) VALUES ('BG');
          INSERT INTO ranks (ranks) VALUES ('MG');
          INSERT INTO ranks (ranks) VALUES ('LG');
          INSERT INTO cats (cats) VALUES ('A');
          INSERT INTO cats (cats) VALUES ('B');
          INSERT INTO cats (cats) VALUES ('C');
          INSERT INTO cats (cats) VALUES ('D');
          INSERT INTO cats (cats) VALUES ('CNX');
          INSERT INTO flights (flights) VALUES ('HQ');
          INSERT INTO flights (flights) VALUES ('S3');
          INSERT INTO flights (flights) VALUES ('APP');
          INSERT INTO flights (flights) VALUES ('AREA');
          INSERT INTO flights (flights) VALUES ('OPS HUB');
          INSERT INTO flights (flights) VALUES ('PARTICIPATION');
          INSERT INTO flights (flights) VALUES ('TRAINING');
          INSERT INTO flights (flights) VALUES ('CMS');
          INSERT INTO positions (positions) VALUES ('CNX');
          INSERT INTO positions (positions) VALUES ('FIS');
          INSERT INTO positions (positions) VALUES ('DEP');
          INSERT INTO positions (positions) VALUES ('ARR');
          INSERT INTO positions (positions) VALUES ('TAP');
          INSERT INTO positions (positions) VALUES ('TAC');
          INSERT INTO positions (positions) VALUES ('PAP');
          INSERT INTO positions (positions) VALUES ('PAC');
          INSERT INTO positions (positions) VALUES ('ISL');
      COMMIT;
    `,
      (err: Error, res: any) => {
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
          INSERT INTO users (username, password) VALUES ('user1', '123');
  
          -- Insert Profile
          INSERT INTO profiles (
            user_id, rank, full_name, id_number, date_of_birth, date_accepted, reporting_date, cat, flight
          )
          VALUES (
            (SELECT id FROM users WHERE username = 'user1'),
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
          INSERT INTO user_positions (user_id, position, start_date, end_date, approval_date)
          VALUES (
            (SELECT id FROM users WHERE username = 'user1'),
            'DEP',
            1400169600,
            1419436800,
            1419955200
          );
  
          INSERT INTO user_positions (user_id, position, start_date, end_date, approval_date)
          VALUES (
            (SELECT id FROM users WHERE username = 'user1'),
            'ISL',
            1423065600,
            1444924800,
            null
          );
  
          INSERT INTO user_positions (user_id, position, start_date, end_date, approval_date)
          VALUES (
            (SELECT id FROM users WHERE username = 'user1'),
            'FIS',
            1452009600,
            null,
            null
          );
  
          -- Insert DEP Assessments
          INSERT INTO assessments (user_position_id, assessment_number, instructor, date, intensity, objective1, a, b, c, d, e, f, g, h, I, j, safety, remarks, is_simulator)
          VALUES (
            (SELECT id FROM user_positions WHERE user_id = (
              SELECT id FROM users WHERE username = 'user1') AND position = 'DEP'
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
              SELECT id FROM users WHERE username = 'user1') AND position = 'DEP'
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
              SELECT id FROM users WHERE username = 'user1') AND position = 'DEP'
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
              SELECT id FROM users WHERE username = 'user1') AND position = 'ISL'
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
              SELECT id FROM users WHERE username = 'user1') AND position = 'ISL'
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
              SELECT id FROM users WHERE username = 'user1') AND position = 'FIS'
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
              SELECT id FROM users WHERE username = 'user1') AND position = 'FIS'
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
            'Needs more training',
            false
          );
  
      COMMIT;
  
      SELECT id FROM assessments WHERE position = 'FIS';
    `,
      (err: Error, res: any) => {
        console.log("Inserted Seed");
      }
    );

    console.log("Seed All - Seeding Completed");
  });
};

export {};

module.exports = seed;
