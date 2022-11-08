"use strict";
const { Client } = require("pg");
const client = new Client();
client.connect((err) => {
    if (err) {
        console.error("connection error", err.stack);
    }
    else {
        console.log(`PostgreSQL Database "${process.env.PGDATABASE}" connected on Port ${process.env.PGPORT}`);
    }
});
client.query(`CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username varchar(20),
    password varchar(20)
  );`, (err, res) => {
    if (err)
        throw err;
});
client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`, (err, res) => {
    if (err)
        throw err;
});
module.exports = {
    query: (text, params, callback) => {
        return client.query(text, params, callback);
    },
};
