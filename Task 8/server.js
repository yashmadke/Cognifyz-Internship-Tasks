const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const redis = require("redis");
const Queue = require("bull");
const fetch = require("node-fetch");

const redisClient = redis.createClient({
  host: "redis-19273.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
  port: 19273,
  password: "a3FugcwoW5QFIzXylt9meFhaWRT02Tom",
  tls: {
    rejectUnauthorized: false,
  },
});

redisClient.on("connect", () => {
  console.log("Connected to remote Redis...");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static("public"));

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");

const emailQueue = new Queue("emailQueue", {
  redis: {
    host: "redis-19273.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 19273,
    password: "a3FugcwoW5QFIzXylt9meFhaWRT02Tom",
  },
});

emailQueue.process((job, done) => {
  console.log(`Processing email for: ${job.data.email}`);
  setTimeout(() => {
    console.log(`Email sent to: ${job.data.email}`);
    done();
  }, 2000);
});

app.get("/", (req, res) => {
  res.render("index", { user: req.session.user });
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  req.session.user = { username };
  res.redirect("/");
});

app.post("/send-email", (req, res) => {
  const { email } = req.body;

  emailQueue.add({ email });

  res.render("emailSent", { email });
});

app.get("/data", async (req, res) => {
  const cacheKey = "apiData";

  redisClient.get(cacheKey, async (err, cachedData) => {
    if (err) throw err;

    if (cachedData) {
      res.json(JSON.parse(cachedData));
    } else {
      const apiResponse = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const data = await apiResponse.json();

      redisClient.setex(cacheKey, 60, JSON.stringify(data));

      res.json(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
