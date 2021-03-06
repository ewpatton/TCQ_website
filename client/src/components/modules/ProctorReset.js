import React, { Component } from "react";
import "../../utilities.css";

import { get, post } from "../../utilities.js";

class ProctorReset extends Component {
  constructor(props) {
    super(props);
    console.log("props");
    console.log(this.props.gameCode);
    // console.log(gameCode)
    // Initialize Default State
    this.state = {
      inputedTeam: "",
    };
  }

  handleSubmit = (event) => {
    console.log(`Team: ${this.state.inputedTeam} and game code ${this.props.gameCode}`);
    const team = this.state.inputedTeam;
    post("/api/proct-reset", {
      gameCode: this.props.gameCode,
      teamName: team,
    });
  };

  handleChangeName = (event) => {
    this.setState({
      inputedTeam: event.target.value,
    });
  };

  render() {
    let teamInput;
    if (this.props.teams.length !== 0) {
      teamInput = (
        <select className="dropDown" onChange={this.handleSelect}>
          <option value="">--Please choose a team--</option>
          {this.props.teams.map((teamName) => (
            <option key={`option-${teamName}`} value={teamName}>
              {teamName}
            </option>
          ))}
        </select>
      );
    }
    return (
      <>
        <h2 className="title">Reset Timer for Team </h2>
        <div className="button-holder login-div">
          <div className="login-div">
            {teamInput}
            {/* <input
              className="login-textbox"
              type="text"
              placeholder="team name"
              onChange={this.handleChangeName}
            /> */}
          </div>
          <span className="button" onClick={this.handleSubmit}>
            <span className="button-text">Submit </span>
          </span>
        </div>
      </>
    );
  }
}

export default ProctorReset;
