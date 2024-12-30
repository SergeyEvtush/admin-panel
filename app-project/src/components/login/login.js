import React, { Component } from "react";

export default class Login extends Component {
  render() {
    return (
      <div className="login-container">
        <div className="login">
          <h2 className="uk-modal-title uk-text-center">Авторизация</h2>
          <div className="uk-margin-top uk-text-lead">Пароль:</div>
          <input
            type="password"
            className="uk-input uk-margin-top"
            name=""
            id=""
            placeholder="Пароль"
          />
          <button
            className="uk-button uk-button-primary uk-margin-top"
            type="button"
          >
            Вход
          </button>
        </div>
      </div>
    );
  }
}
