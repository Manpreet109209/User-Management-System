const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express();
const SALT_ROUNDS = 10;

// Middlewares
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Database connection using environment variables
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

connection.connect(err => {
  if (err) {
    console.error("DB connection failed:", err);
    process.exit(1); // stop server if DB not connected
  } else {
    console.log("DB connected successfully");
  }
});

// ROUTES

// HOME
app.get("/", (req, res) => {
  const q = "SELECT count(*) AS count FROM users";
  connection.query(q, (err, result) => {
    if (err) return res.send("DB error");
    res.render("home.ejs", { count: result[0].count });
  });
});

// SHOW USERS
app.get("/user", (req, res) => {
  const q = "SELECT * FROM users";
  connection.query(q, (err, users) => {
    if (err) return res.send("DB error");
    res.render("users.ejs", { users });
  });
});

// NEW USER FORM
app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

// CREATE USER (HASH PASSWORD)
app.post("/user/new", async (req, res) => {
  const { username, email, password } = req.body;
  const id = faker.datatype.uuid();

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const q = "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)";
    connection.query(q, [id, username, email, hashedPassword], err => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.error(err);
    res.send("Error creating user");
  }
});

// EDIT USER
app.get("/user/:id/edit", (req, res) => {
  const { id } = req.params;
  const q = "SELECT * FROM users WHERE id = ?";
  connection.query(q, [id], (err, result) => {
    if (err) return res.send("DB error");
    res.render("edit.ejs", { user: result[0] });
  });
});

// UPDATE USERNAME VERIFY PASSWORD WITH BCRYPT
app.patch("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { password, username } = req.body;
  const q = "SELECT * FROM users WHERE id = ?";

  connection.query(q, [id], async (err, result) => {
    if (err) return res.send("DB error");
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Wrong password");

    const q2 = "UPDATE users SET username = ? WHERE id = ?";
    connection.query(q2, [username, id], err => {
      if (err) return res.send("Update failed");
      res.redirect("/user");
    });
  });
});

// DELETE CONFIRM PAGE
app.get("/user/:id/delete", (req, res) => {
  const { id } = req.params;
  const q = "SELECT * FROM users WHERE id = ?";
  connection.query(q, [id], (err, result) => {
    if (err) return res.send("DB error");
    res.render("delete.ejs", { user: result[0] });
  });
});

// DELETE USER VERIFY PASSWORD WITH BCRYPT
app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const q = "SELECT * FROM users WHERE id = ?";

  connection.query(q, [id], async (err, result) => {
    if (err) return res.send("DB error");
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Wrong password");

    const q2 = "DELETE FROM users WHERE id = ?";
    connection.query(q2, [id], err => {
      if (err) return res.send("Delete failed");
      res.redirect("/user");
    });
  });
});

// START SERVER
const PORT = process.env.PORT || 2211;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));