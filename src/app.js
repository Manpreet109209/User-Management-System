const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const userRoutes = require("./routes/user.routes");

const app = express();

// ✅ THIS WAS MISSING
app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", userRoutes);

module.exports = app;