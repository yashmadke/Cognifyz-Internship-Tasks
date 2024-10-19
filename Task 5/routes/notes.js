const express = require("express");

const router = express.Router();

let notes = [];
let nextId = 1;

router.get("/", (req, res) => {
  res.render("index", { notes });
});

router.get("/new", (req, res) => {
  res.render("new-note");
});

router.post("/", (req, res) => {
  const { title, content } = req.body;

  notes.push({ id: nextId++, title, content });

  res.redirect("/notes");
});

router.get("/edit/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  const note = notes.find((n) => n.id === noteId);

  if (note) {
    res.render("edit-note", { note });
  } else {
    res.status(404).send("Note not found");
  }
});

router.post("/edit/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  const noteIndex = notes.findIndex((n) => n.id === noteId);

  if (noteIndex !== -1) {
    notes[noteIndex] = {
      id: noteId,
      title: req.body.title,
      content: req.body.content,
    };
  }

  res.redirect("/notes");
});

router.post("/delete/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  notes = notes.filter((n) => n.id !== noteId);
  res.redirect("/notes");
});

module.exports = router;
