import React, { Component } from "react";
import PartInput from "./PartInput.js";
import "../../utilities.css";
import "../pages/New-Game.css";

// @param id: Number
// @param handleChangePoints
// @param handleChangeQuestion
// @param handleChangeTime
class QuestionInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numParts: 1,
      questions: [""],
      points: [0],
    };
    // Initialize Default State
  }

  handleChangeNumParts = (event) => {
    let numParts = parseInt(event.target.value);
    if (isNaN(numParts)) {
      numParts = 1;
    }
    this.setState({
      numParts: numParts,
      questions: new Array(numParts).fill(""),
      points: new Array(numParts).fill(0),
    });
  };

  handleChangeQuestion = (partNum, newQuestion) => {
    let toReturn = this.state.questions;
    toReturn[partNum - 1] = newQuestion;
    this.setState({
      questions: toReturn,
    });
    this.props.changeQuestion(this.props.id, toReturn);
  };

  handleChangeTime = (event) => {
    this.props.changeTime(this.props.id, event.target.value);
  };

  handleChangePoints = (partNum, newPoints) => {
    let toReturn = this.state.points;
    toReturn[partNum - 1] = newPoints;
    this.setState({
      points: toReturn,
    });
    this.props.changePoints(this.props.id, toReturn);
  };

  render() {
    const numPartsArray = Array.from({ length: this.state.numParts }, (x, i) => i);
    console.log(numPartsArray);
    let PartInputs = numPartsArray.map((iterator, i) => (
      <PartInput
        key={`part-input-${i}`}
        id={i + 1}
        changeQuestion={this.handleChangeQuestion}
        changePoints={this.handleChangePoints}
      />
    ));

    return (
      <>
        <div>
          <span className="standard-text">
            <h2 className="header-text"> Question {this.props.id}: </h2>
            <div className="New-Game-numQ">
              <span className="standard-text">Number of Parts:</span>
              <span className="New-Game-numQ-span">
                <input
                  className="small-text-box"
                  type="number"
                  onChange={this.handleChangeNumParts}
                />
              </span>
            </div>
            Time (in seconds):
            <input className="small-text-box" type="number" onChange={this.handleChangeTime} />
            {PartInputs}
          </span>
        </div>
      </>
    );
  }
}

export default QuestionInput;
