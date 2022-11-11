"use strict";
const { Client } = require("pg");
// Creation of new Client. Host, Port, User, Password, Database are automatically pulled from .env
const client = new Client();
// Connecting to DB
client.connect((err) => {
    if (err) {
        console.error("connection error", err.stack);
    }
    else {
        console.log(`PostgreSQL Database "${process.env.PGDATABASE}" connected on Port ${process.env.PGPORT}`);
    }
});
// If you intend to use UUID
client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`, (err, res) => {
    if (err)
        throw err;
});
// Export the query function to be used in your controllers
module.exports = {
    query: (text, params, callback) => {
        return client.query(text, params, callback);
    },
};
