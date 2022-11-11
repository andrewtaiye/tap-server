const client = require("./db");

const seed = async () => {
  let query = `
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public'
    );
  `;
  let result = await client.query(query);

  if (result.rows[0].exists) {
    console.log("Tables already exist");
    return;
  }

  // Set up of tables
  client.query(
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
        grade smallint NOT NULL,
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
    `,
    (err: Error, res: any) => {
      if (err) throw err;
      console.log(res);
      console.log("Tables Created");
    }
  );

  // Insert default values for ranks, cats, flights, positions
  client.query(
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
};

export {};

module.exports = seed;
