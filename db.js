import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tslife",
  port: 8889,
});

export { db };
