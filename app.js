//app.js
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const dbConfig = require("./config/db.config.js");
const mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
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
const Article = db.article;

app.get("/", (req, res) => {
  const token = req.body.token
  jwt.verify(token, 'shhhhh', function (err, decoded) {
    if (err) return res.sendStatus(401)
    res.status(200).send("Hello World!");
  })
});

app.get('/users', (req, res) => {
  if (!req.body.token) {
    res.status(400).send({ message: "token can not be empty!" });
    return;
  }
  const token = req.body.token
  jwt.verify(token, 'shhhhh', function (err, decoded) {
    if (err) return res.sendStatus(401)
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
});

app.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({ message: "username or password can not be empty!" });
    return;
  }
  User.find()
    .then(data => {
      for (const user of data) {
        if (user.username === req.body.username && user.password === req.body.password) {
          console.log('121213', user, jwt)
          var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'shhhhh');
          console.log({ token })
          return res.json({ token });
        }
      }
      return res.sendStatus(400);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
});

app.post('/user', (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.token) {
    res.status(400).send({ message: "token or username or password can not be empty!" });
    return;
  }
  const token = req.body.token
  jwt.verify(token, 'shhhhh', function (err, decoded) {

    if (err) return res.sendStatus(401)
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
});

app.get('/articles', (req, res) => {


  Article.find()
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

app.post('/article', (req, res) => {
  if (!req.body.title || !req.body.content || !req.body.token) {
    res.status(400).send({ message: "title or content or token can not be empty!" });
    return;
  }
  const token = req.body.token
  jwt.verify(token, 'shhhhh', function (err, decoded) {
    if (err) return res.sendStatus(401)
    // console.log(decoded) // bar
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
      writer: decoded.username
    });

    article
      .save(article)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Article."
        });
      });
  });
});

module.exports = app;