const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverrider = require("method-override");

app.use(methodOverrider("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const conection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: '5262'
});

let BringRandomUser = () => {
  return [
    faker.datatype.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// home page
app.get("/", (req, res) => {
  let q = "SELECT count(*) FROM users;";
  try {
    conection.query(q, (err, result) => {
        if (err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs", { count });
    });
} catch (err) {
    res.send("We are sorry to let you know that we're having a hard time fixing bugs T-T");
}
});

// Shows users
app.get("/user", (req, res) => {
  let q = "SELECT * FROM users;";
  try {
    conection.query(q, (err, users) => {
        if (err) throw err;
        res.render("users.ejs", {users} );
    });
} catch (err) {
    res.send("We are sorry to let you know that we're having a hard time fixing bugs T-T");
}
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM users WHERE id='${id}'`;
    try {
    conection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
        res.render("edit.ejs", {user} );
    });
} catch (err) {
    res.send("We are sorry to let you know that we're having a hard time fixing bugs T-T");
}
});

// UPDATE DB ROUTE
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let {password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM users WHERE id='${id}'`;
      try {
    conection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
        if (formPass != user.password) {
          res.send("Clean your head and rewrite the Password just cause it's wrong!")
        } else {
          let q2 = `UPDATE users SET username='${newUsername}' WHERE id='${id}'`;
          conection.query(q2, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.redirect("/user");
          });
        }
    });
} catch (err) {
    res.send("We are sorry to let you know that we're having a hard time fixing bugs T-T");
}
});

app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = faker.datatype.uuid();
  let q = `INSERT INTO users (id, username, email, password) VALUES ('${id}', '${username}', '${email}', '${password}')`;
  try {
    conection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect("/user");
    });
  } catch (err) {
    res.send("We are sorry to let you know that we're having a hard time fixing bugs T-T");
  }
});

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM users WHERE id='${id}'`;

  try {
    conection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM users WHERE id='${id}'`;

  try {
    conection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `DELETE FROM users WHERE id='${id}'`; //Query to Delete
        conection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("deleted!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.listen("2211", () => {
    console.log("server is listening to port 8080");
});

// INSERTING FAKE USERS

// let q = "INSERT INTO users (id, username, email, password) VALUES ?";
// let data = [];

// for(let i=0; i <100; i++) {
//   data.push(BringRandomUser());
// }

// try {
//     conection.query(q, [data], (err, res) => {
//         if (err) throw err;
//         console.log(res);
//     });
// } catch (err) {
//     console.log(err);
// }
// conection.end();
