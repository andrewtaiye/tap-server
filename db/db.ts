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
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username varchar(20),
    password varchar(20)
  );`,
  (err: Error, res: any) => {
    if (err) throw err;
  }
);

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
