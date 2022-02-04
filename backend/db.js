const Pool = require("pg").Pool;

const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  database: "project4_database",
});

module.exports = pool;
