const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// temporary server side storage
let submissions = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

// server side validation
function validateFormData(data) {
  const errors = {};

  if (!data.name || data.name.length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(data.email)) {
    errors.email = "Invalid email address";
  }

  if (!data.password || data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!data.age || data.age < 18 || data.age > 100) {
    errors.age = "Age must be between 18 and 100";
  }

  if (
    !data.gender ||
    (data.gender !== "male" &&
      data.gender !== "female" &&
      data.gender !== "other")
  ) {
    errors.gender = "Invalid gender.";
  }

  return errors;
}

app.post("/submit", (req, res) => {
  const { name, email, password, age, gender } = req.body;
  const errors = validateFormData(req.body);

  if (Object.keys(errors).length > 0) {
    res.status(400).send(errors);
  } else {
    submissions.push({ name, email, password, age, gender });

    res.send(
      `Form submitted successfully! Name: ${name}, Email: ${email}, Age: ${age}, Gender: ${gender}`
    );
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
