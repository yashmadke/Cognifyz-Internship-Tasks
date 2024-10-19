const express = require("express");
const bodyParser = require("body-parser");

const notesRouter = require("./routes/notes");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/notes", notesRouter);

app.get("/", (req, res) => {
  res.redirect("/notes");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
