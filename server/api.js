/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const Game = require("./models/game");
const Answer = require("./models/answer");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// takes the game code as the parameter code
router.post("/new-game/", (req, res) => {
  const newGame = new Game({
    gameCode: req.body.gameCode,
    parts: req.body.parts,
    questions: req.body.questions,
    times: req.body.times,
    points: req.body.points,
    questionPasswords: req.body.questionPasswords,
    adminPassword: req.body.adminPassword,
  });
  newGame.save();
  console.log("POSTED");
});

router.get("/game-info/", (req, res) => {
  console.log(`QUERY: ${req.query.gameCode}`);
  Game.findOne({ gameCode: req.query.gameCode }).then((results) => {
    console.log(results);
    res.send(results);
  });
});

// given the gameCode, questionNum, startTime, teamName
router.post("/start-time/", (req, res) => {
  const currDate = new Date().toLocaleString();
  const newAnswer = new Answer({
    gameCode: req.body.gameCode,
    questionNumber: req.body.questionNum,
    team: req.body.teamName,
    content: [],
    startTime: currDate,
  });
  console.log("here is the new answer: ");
  console.log(newAnswer);
  newAnswer.save();
});

// given the gameCode, questionNum, teamName, content
router.post("/student-answers/", (req, res) => {
  console.log("adding the actual answer to the mix");
  Answer.findOne({
    gameCode: req.body.gameCode,
    questionNumber: req.body.questionNum,
    team: req.body.teamName,
  }).then((answer) => {
    if (answer !== null) {
      answer.content = req.body.content;
      console.log("here is the updated answer with content");
      console.log(answer);
      answer.save();
    } else {
      console.log("Could not find the answer with these attributes:");
      console.log(req.body.questionNum + " " + req.body.gameCode + " " + req.body.teamName);
    }
  });
});

// given the gameCode and questionNum, get all the answers
router.get("/answers/", (req, res) => {
  Answer.find({
    gameCode: req.query.gameCode,
    questionNumber: req.query.questionNum,
  }).then((results) => {
    res.send(results);
  });
});

// given the gameCode
router.get("/start-times/", (req, res) => {
  Answer.find({ gameCode: req.query.gameCode }).then((results) => {
    res.send(results);
  });
});

// // given the gameCode, questionNum, grades
// router.post("/grades/", (req, res) => {});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
