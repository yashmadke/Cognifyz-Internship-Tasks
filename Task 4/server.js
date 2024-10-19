const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

const PORT = 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

let formDataStorage = [];

app.get("/", (req, res) => {
  res.render("index", { errors: {} });
});

app.get("/form", (req, res) => {
  res.render("form", { errors: {} });
});

app.post("/submit", (req, res) => {
  const { name, email, password, age, gender } = req.body;
  const errors = {};

  if (name.length < 3) {
    errors.name = "Name must be at least 3 characters long.";
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    errors.email = "Invalid email address.";
  }

  if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
  } else if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
    errors.password =
      "Password must contain at least one uppercase letter and one number.";
  }

  if (age < 18 || age > 100) {
    errors.age = "Age must be between 18 and 100.";
  }

  if (!gender) {
    errors.gender = "Please select your gender.";
  }

  if (Object.keys(errors).length > 0) {
    return res.render("form", { errors });
  }

  formDataStorage.push({ name, email, password, age, gender });

  res.send(
    '<h1>Form submitted successfully!</h1><p><a href="/">Go back</a></p>'
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
