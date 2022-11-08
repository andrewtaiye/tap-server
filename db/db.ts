const { Client } = require("pg");

// Creation of new Client. Host, Port, User, Password, Database are automatically pulled from .env
const client = new Client();

// Connecting to DB
client.connect((err: Error) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log(
      `PostgreSQL Database "${process.env.PGDATABASE}" connected on Port ${process.env.PGPORT}`
    );
  }
});

// If you intend to use UUID
client.query(
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
  (err: Error, res: any) => {
    if (err) throw err;
  }
);

// Set up of tables
client.query(
  `CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4() UNIQUE,
    username varchar(20) NOT NULL UNIQUE,
    password varchar(20) NOT NULL
  );`,
  (err: Error, res: any) => {
    if (err) throw err;
  }
);

client.query(
  `CREATE TABLE IF NOT EXISTS positions (
    position char(3) NOT NULL PRIMARY KEY UNIQUE
  )`,
  (err: Error, res: any) => {
    if (err) throw err;
  }
);

client.query(
  `CREATE TABLE IF NOT EXISTS ranks (
    rank varchar(4) NOT NULL PRIMARY KEY UNIQUE
  )`,
  (err: Error, res: any) => {
    if (err) throw err;
  }
);

client.query(
  `CREATE TABLE IF NOT EXISTS cats (
    cat varchar(3) NOT NULL PRIMARY KEY UNIQUE
  )`,
  (err: Error, res: any) => {
    if (err) throw err;
  }
);

client.query(
  `CREATE TABLE IF NOT EXISTS flights (
    flight varchar(15) NOT NULL PRIMARY KEY UNIQUE
  )`,
  (err: Error, res: any) => {
    if (err) throw err;
  }
);

client.query(
  `CREATE TABLE IF NOT EXISTS profiles (
    user_id uuid PRIMARY KEY UNIQUE,
    rank varchar(4) NOT NULL,
    full_name varchar(50) NOT NULL,
    date_of_birth date NOT NULL,
    date_accepted date NOT NULL,
    reporting_date date NOT NULL,
    cat varchar(3) NOT NULL,
    flight varchar(15) NOT NULL,
    CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT FK_rank FOREIGN KEY (rank) REFERENCES ranks (rank),
    CONSTRAINT FK_cat FOREIGN KEY (cat) REFERENCES cats (cat),
    CONSTRAINT FK_flight FOREIGN KEY (flight) REFERENCES flights (flight)
  )`,
  (err: Error, res: any) => {
    if (err) throw err;
  }
);

client.query(
  `CREATE TABLE IF NOT EXISTS user_positions (
    id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    position char(3) NOT NULL,
    start_date date NOT NULL,
    end_date date,
    approval_date date,
    is_revalidation boolean NOT NULL,
    is_instructor boolean NOT NULL,
    CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT FK_position FOREIGN KEY (position) REFERENCES positions (position)
  )`,
  (err: Error, res: any) => {
    if (err) throw err;
  }
);

client.query(
  `CREATE TABLE IF NOT EXISTS assessments (
    id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
    user_position_id uuid NOT NULL,
    assessment_number smallint NOT NULL,
    instructor varchar(50) NOT NULL,
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
  )`,
  (err: Error, res: any) => {
    if (err) throw err;
  }
);

client.query(
  `CREATE TABLE IF NOT EXISTS tokens (
      id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
      token varchar(50) NOT NULL,
      type varchar(7) NOT NULL,
      parent_token varchar(50)
    )`,
  (err: Error, res: any) => {
    if (err) throw err;
  }
);

// Insert default values for ranks, cats, flights, positions
// client.query(`
//   INSERT INTO ranks (rank) VALUES ('2LT');
//   INSERT INTO ranks (rank) VALUES ('LTA');
//   INSERT INTO ranks (rank) VALUES ('CPT');
//   INSERT INTO ranks (rank) VALUES ('MAJ');
//   INSERT INTO ranks (rank) VALUES ('LTC');
//   INSERT INTO ranks (rank) VALUES ('SLTC');
//   INSERT INTO ranks (rank) VALUES ('COL');
//   INSERT INTO ranks (rank) VALUES ('BG');
//   INSERT INTO ranks (rank) VALUES ('MG');
//   INSERT INTO ranks (rank) VALUES ('LG');
//   INSERT INTO cats (cat) VALUES ('A');
//   INSERT INTO cats (cat) VALUES ('B');
//   INSERT INTO cats (cat) VALUES ('C');
//   INSERT INTO cats (cat) VALUES ('D');
//   INSERT INTO cats (cat) VALUES ('CNX');
//   INSERT INTO flights (flight) VALUES ('HQ');
//   INSERT INTO flights (flight) VALUES ('S3');
//   INSERT INTO flights (flight) VALUES ('APP');
//   INSERT INTO flights (flight) VALUES ('AREA');
//   INSERT INTO flights (flight) VALUES ('OPS HUB');
//   INSERT INTO flights (flight) VALUES ('PARTICIPATION');
//   INSERT INTO flights (flight) VALUES ('TRAINING');
//   INSERT INTO flights (flight) VALUES ('CMS');
//   INSERT INTO positions (position) VALUES ('CNX');
//   INSERT INTO positions (position) VALUES ('FIS');
//   INSERT INTO positions (position) VALUES ('DEP');
//   INSERT INTO positions (position) VALUES ('ARR');
//   INSERT INTO positions (position) VALUES ('TAP');
//   INSERT INTO positions (position) VALUES ('TAC');
//   INSERT INTO positions (position) VALUES ('PAP');
//   INSERT INTO positions (position) VALUES ('PAC');
//   INSERT INTO positions (position) VALUES ('ISL');
// `);

// Export the query function to be used in your controllers
module.exports = {
  query: (
    text: string,
    params?: any[],
    callback?: (err: Error, params: any[], res: any) => void
  ) => {
    return client.query(text, params, callback);
  },
};
