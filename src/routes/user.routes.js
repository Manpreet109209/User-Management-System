const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

router.get("/", controller.home);
router.get("/user", controller.getUsers);
router.get("/user/new", controller.newUserForm);
router.post("/user/new", controller.createUser);
router.get("/user/:id/edit", controller.editUserForm);
router.patch("/user/:id", controller.updateUser);
router.get("/user/:id/delete", controller.deleteConfirm);
router.delete("/user/:id", controller.deleteUser);

module.exports = router;