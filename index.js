const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const path = require("path");
const methodOverrider = require("method-override");

const SALT_ROUNDS = 10;

app.use(methodOverrider("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "5262",
});

// HOME
app.get("/", (req, res) => {
  let q = "SELECT count(*) AS count FROM users";
  connection.query(q, (err, result) => {
    if (err) return res.send("DB error");
    res.render("home.ejs", { count: result[0].count });
  });
});

// SHOW USERS
app.get("/user", (req, res) => {
  let q = "SELECT * FROM users";
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
  let { username, email, password } = req.body;
  let id = faker.datatype.uuid();

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let q = `
      INSERT INTO users (id, username, email, password)
      VALUES (?, ?, ?, ?)
    `;

    connection.query(q, [id, username, email, hashedPassword], err => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    res.send("Error creating user");
  }
});

// EDIT USER
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = "SELECT * FROM users WHERE id = ?";

  connection.query(q, [id], (err, result) => {
    if (err) return res.send("DB error");
    res.render("edit.ejs", { user: result[0] });
  });
});

// UPDATE USERNAME (VERIFY PASSWORD WITH BCRYPT)
app.patch("/user/:id", async (req, res) => {
  let { id } = req.params;
  let { password, username } = req.body;

  let q = "SELECT * FROM users WHERE id = ?";

  connection.query(q, [id], async (err, result) => {
    if (err) return res.send("DB error");

    let user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Wrong password");
    }

    let q2 = "UPDATE users SET username = ? WHERE id = ?";
    connection.query(q2, [username, id], err => {
      if (err) return res.send("Update failed");
      res.redirect("/user");
    });
  });
});

// DELETE CONFIRM PAGE
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = "SELECT * FROM users WHERE id = ?";

  connection.query(q, [id], (err, result) => {
    if (err) return res.send("DB error");
    res.render("delete.ejs", { user: result[0] });
  });
});

// DELETE USER (VERIFY PASSWORD WITH BCRYPT)
app.delete("/user/:id", async (req, res) => {
  let { id } = req.params;
  let { password } = req.body;

  let q = "SELECT * FROM users WHERE id = ?";

  connection.query(q, [id], async (err, result) => {
    if (err) return res.send("DB error");

    let user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Wrong password");
    }

    let q2 = "DELETE FROM users WHERE id = ?";
    connection.query(q2, [id], err => {
      if (err) return res.send("Delete failed");
      res.redirect("/user");
    });
  });
});

app.listen(2211, () => {
  console.log("Server running on port 2211");
});
