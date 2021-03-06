import React, { Component } from "react";

import QuestionLogin from "./QuestionLogin.js";
import ImageDisplay from "./ImageDisplay.js";

import "../pages/New-Game.css";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";

// PROPS:
//   gameCode: String,
//   questionNumber: number,
//   teamName: String
//   questions: [String],
//   time: Number,
//   points: [Number],
//   password: String
//   nextQuestion: a function that makes the game go to the next question
class QuestionPage extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      authorized: false,
      answers: new Array(this.props.questions.length).fill(""),
      time: this.props.time,
      reset: false,
      images: [],
    };

    socket.on(`updateText:${this.props.teamName}:${this.props.gameCode}`, (newAns) => {
      this.setState({
        answers: newAns,
      });
      console.log("the new socket answers: " + newAns);
    });

    socket.on(`nextQ:${this.props.teamName}:${this.props.gameCode}`, () => {
      if (!this.state.authorized) {
        const intervalId = setInterval(this.decreaseTimer, 1000);
        this.setState({ authorized: true, intervalId: intervalId });
      }
    });

    socket.on(`proctResetTime:${this.props.teamName}:${this.props.gameCode}`, () => {
      console.log("proctor reset timer socket on! ");
      this.setState({
        time: this.props.time,
        answers: new Array(this.props.questions.length).fill(""),
        reset: true,
      });
    });
  }

  componentDidMount() {
    console.log("getting the images");
    console.log(this.props.gameCode);
    console.log(this.props.questionNumber);
    get("/api/images/", {
      gameCode: this.props.gameCode,
      questionNum: this.props.questionNumber,
    }).then((results) => {
      console.log(results);
      console.log("GOT THE IMAGES");
      this.setState({
        images: results,
      });
    });
  }

  decreaseTimer = () => {
    console.log("timer:");
    console.log(this.state.time);
    if (this.state.time === 0) {
      this.handleOutOfTime();
    }
    if (this.state.authorized) {
      this.setState({
        time: this.state.time - 1,
        reset: false,
      });
      // post("/api/test", { time: this.state.time });
      // console.log("I'm posting to the socket the answer: " + this.state.answers);
      // post("/api/textbox-update/", {
      //   gameCode: this.props.gameCode,
      //   newAns: this.state.answers,
      //   teamName: this.props.teamName,
      // }).then(console.log("finished post request"));
    }
  };

  handleOutOfTime = () => {
    clearInterval(this.state.intervalId);
    console.log(
      "I'm posting this as the answer to question " +
        this.props.questionNumber +
        " for team " +
        this.props.teamName
    );
    console.log(this.state.answers);
    post("/api/student-answers/", {
      gameCode: this.props.gameCode,
      questionNum: this.props.questionNumber,
      teamName: this.props.teamName,
      content: this.state.answers,
    });
    this.setState({
      authorized: false,
      time: this.props.nextQuestionTime,
      answers: new Array(this.props.questions.length).fill(""),
    });
    this.props.nextQuestion();
  };

  loggedIn = () => {
    const intervalId = setInterval(this.decreaseTimer, 1000);
    this.setState({ authorized: true, intervalId: intervalId });
    // this.setState({ authorized: true});

    post("/api/start-time/", {
      gameCode: this.props.gameCode,
      questionNum: this.props.questionNumber,
      teamName: this.props.teamName,
    });
  };

  handleAnswerChange = (partNum, newAnswer) => {
    let newAnswers = this.state.answers;
    newAnswers[partNum] = newAnswer;
    this.setState({
      answers: newAnswers,
    });
    // post("/api/test", { time: this.state.time });
    console.log("I'm posting to the socket the answer: " + this.state.answers);
    post("/api/textbox-update/", {
      gameCode: this.props.gameCode,
      newAns: newAnswers,
      teamName: this.props.teamName,
    }).then(console.log("finished post request"));
  };

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    if (this.state.authorized === false) {
      return (
        <>
          <QuestionLogin
            password={this.props.password}
            name={this.props.name}
            questionNum={this.props.questionNumber}
            teamName={this.props.teamName}
            time={this.state.time}
            onSuccess={this.loggedIn}
          />
        </>
      );
    }

    return (
      <>
        <h1> Question {String.fromCharCode(this.props.questionNumber - 1 + "A".charCodeAt(0))} </h1>
        <p> Time remaining: {this.state.time} </p>
        {this.props.questions.map((singleQuestion, i) => (
          <div key={`question-${i}`}>
            <h2> Part {i + 1} </h2>
            <ImageDisplay
              gameCode={this.props.gameCode}
              images={this.state.images.filter((elem) => {
                return elem.partNum === i + 1;
              })}
            />
            <p> {singleQuestion} </p>
            <p> (worth {this.props.points[i]} points) </p>
            <textarea
              rows="10"
              cols="80"
              className="large-text-box"
              value={this.state.answers[i]}
              onChange={(event) => this.handleAnswerChange(i, event.target.value)}
            />
          </div>
        ))}
      </>
    );
  }
}

export default QuestionPage;
