import React, { Component } from "react";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pass: "",
    };
  }
  onPasswordChange(e) {
    this.setState({
      pass: e.target.value,
    });
  }
  render() {
    const { pass } = this.state;
    const { login, lengthErr, logErr } = this.props;
    let renderLogErr, renderLengthErr;
    logErr
      ? (renderLogErr = (
          <span className="login-error">Введен неправильный пароль</span>
        ))
      : null;
    lengthErr
      ? (renderLengthErr = (
          <span className="login-error">Пароль слишком короткий</span>
        ))
      : null;
    return (
      <div className="login-container">
        <div className="login">
          <h2 className="text-center fs-1">Авторизация</h2>
          <label className="mt-2 uk-text-lead">Пароль:</label>
          <div className="input-group input-group-lg">
            <span className="input-group-text" id="inputGroup-sizing-lg">
              Password
            </span>
            <input
              type="password"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-lg"
              value={pass}
              onChange={(e) => this.onPasswordChange(e)}
            />
            {renderLogErr}
            {renderLengthErr}
          </div>
          <button
            type="button"
            className="btn btn-success mt-2"
            onClick={() => login(pass)}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }
}
