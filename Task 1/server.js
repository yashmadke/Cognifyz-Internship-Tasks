const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// set EJS as viwe engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit", (req, res) => {
  const { name, email, message } = req.body;

  res.send(`Form submitted! Name: ${name}, Email: ${email}, Message: ${message}`);
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
