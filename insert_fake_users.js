const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
require("dotenv").config();

const SALT_ROUNDS = 10;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

async function insertFakeUsers(count = 50) {
  let users = [];

  for (let i = 0; i < count; i++) {
    const id = faker.datatype.uuid();
    const username = faker.internet.userName();
    const email = faker.internet.email();

    // fake plain password (But never stored directly)
    const plainPassword = faker.internet.password(12);

    // hashing the password like a real civilized backend
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    users.push([id, username, email, hashedPassword]);
  }

  const q = `
    INSERT INTO users (id, username, email, password)
    VALUES ?
  `;

  connection.query(q, [users], (err, result) => {
    if (err) {
      console.error("Insert failed:", err);
    } else {
      console.log(`Inserted ${result.affectedRows} fake users`);
    }
    connection.end();
  });
}

insertFakeUsers(100);

// To Add Fake Users Open The Terminal And Type " node insert_fake_users.js "