const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

const PORT = 3000;

// set the view engine
app.set("view engine", "ejs");

// middleware foor parsing form data
app.use(bodyParser.urlencoded({ extended: false }));

// server static files
app.use(express.static(path.join(__dirname, "public")));

let formDataStorage = [];

app.get("/", (req, res) => {
  res.render("index", { errors: {} });
});

app.post("/submit", (req, res) => {
  const { name, email, password, age, gender } = req.body;
  const errors = {};

  if (name.length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    errors.email = "Invalid email address.";
  }

  if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (age < 18 || age > 100) {
    errors.age = "Age must be between 18 and 100.";
  }

  if (!gender) {
    errors.gender = "Please select your gender.";
  }

  if (Object.keys(errors).length > 0) {
    return res.render("index", { errors });
  }

  formDataStorage.push({ name, email, password, age, gender });

  res.send(
    '<h1>Form submitted successfully!</h1><p><a href="/">Go back</a></p>'
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
