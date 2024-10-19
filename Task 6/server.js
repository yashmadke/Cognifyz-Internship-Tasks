const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose
  .connect("mongodb://localhost:27017/userAuth")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(
  session({
    secret: "yashmadke",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/userAuth",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

const ensureAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/register", (req, res) => {
  res.render("register", { errors: [] });
});

app.post("/register", async (req, res) => {
  const { username, email, password, password2 } = req.body;

  let errors = [];

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", { errors });
  } else {
    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.render("register", { errors: [{ msg: "User already exists" }] });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();

        res.redirect("/login");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
});

app.get("/login", (req, res) => {
  res.render("login", { errors: [] });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        errors: [{ msg: "Invalid email or password" }],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", {
        errors: [{ msg: "Invalid email or password" }],
      });
    }

    req.session.user = user;

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/dashboard", ensureAuth, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/dashboard");
    }

    res.clearCookie("connect.sid");

    res.redirect("/login");
  });
});

app.use("/api/secure-data", ensureAuth, (req, res) => {
  res.json({ data: "This is secure data, only for logged-in users!" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
