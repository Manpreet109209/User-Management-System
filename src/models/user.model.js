const connection = require("../config/db");

exports.countUsers = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT count(*) AS count FROM users", (err, result) => {
      if (err) return reject(err);
      resolve(result[0].count);
    });
  });
};

exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM users", (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

exports.createUser = (id, username, email, password) => {
  return new Promise((resolve, reject) => {
    const q = "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)";
    connection.query(q, [id, username, email, password], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.updateUsername = (id, username) => {
  return new Promise((resolve, reject) => {
    const q = "UPDATE users SET username = ? WHERE id = ?";
    connection.query(q, [username, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    const q = "DELETE FROM users WHERE id = ?";
    connection.query(q, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};