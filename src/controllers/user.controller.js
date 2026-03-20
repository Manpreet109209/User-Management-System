const { faker } = require("@faker-js/faker");
const userModel = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/hash");

// small helper to stop repeating try/catch like a robot
const asyncHandler = (fn) => (req, res) => {
  Promise.resolve(fn(req, res)).catch((err) => {
    console.error(err);
    return res.status(503).render("databaseError");
  });
};

// HOME
exports.home = asyncHandler(async (req, res) => {
  const count = await userModel.countUsers();
  res.render("home", { count, title: "Home" });
});

// GET ALL USERS
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await userModel.getAllUsers();
  res.render("users/users", { users, title: "All Users" });
});

// FORM
exports.newUserForm = (req, res) => {
  res.render("users/new", { title: "Add User" });
};

// CREATE USER
exports.createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // basic validation (don’t let chaos enter your DB)
  if (!username || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  const id = faker.datatype.uuid();
  const hashed = await hashPassword(password);

  await userModel.createUser(id, username, email, hashed);

  res.redirect("/user");
});

// EDIT FORM
exports.editUserForm = asyncHandler(async (req, res) => {
  const user = await userModel.getUserById(req.params.id);

  if (!user) {
    return res.status(404).send("User not found");
  }

  res.render("users/edit", { user, title: "Edit User" });
});

// UPDATE USER
exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password, username } = req.body;

  if (!password || !username) {
    return res.status(400).send("Missing required fields");
  }

  const user = await userModel.getUserById(id);

  if (!user) {
    return res.status(404).send("User not found");
  }

  const match = await comparePassword(password, user.password);

  if (!match) {
    return res.status(401).render("error");
  }

  await userModel.updateUsername(id, username);

  res.redirect("/user");
});

// DELETE CONFIRM
exports.deleteConfirm = asyncHandler(async (req, res) => {
  const user = await userModel.getUserById(req.params.id);

  if (!user) {
    return res.status(404).send("User not found");
  }

  res.render("users/delete", { user, title: "Delete User" });
});

// DELETE USER
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).send("Password is required");
  }

  const user = await userModel.getUserById(id);

  if (!user) {
    return res.status(404).send("User not found");
  }

  const match = await comparePassword(password, user.password);

  if (!match) {
    return res.status(401).render("error");
  }

  await userModel.deleteUser(id);

  res.redirect("/user");
});