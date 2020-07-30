//app.js
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const dbConfig = require("./config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.article = require("./models/article.model.js")(mongoose);
db.user = require('./models/user.model')(mongoose);
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const User = db.user;

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.get('/users', (req, res) => {
  User.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
});

app.post('/users', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({ message: "username or password can not be empty!" });
    return;
  }
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user
    .save(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
});

module.exports = app;