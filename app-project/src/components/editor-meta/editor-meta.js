import React, { Component } from "react";
//закончил на 7,46
export default class EditorMeta extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { modal, target } = this.props;
    return (
      <div id={target} uk-modal={modal.toString()} container="false">
        <div className="uk-modal-dialog uk-modal-body">
          <h2 className="uk-modal-title">Редактирование МетаТегов</h2>
          <form>
            <div className="uk-margin">
              <input
                className="uk-input"
                type="text"
                placeholder="Title"
                aria-label="Title"
              />
            </div>
            <div className="uk-margin">
              <textarea
                className="uk-textarea"
                rows="5"
                placeholder="KeyWords"
                aria-label="KeyWords"
              />
            </div>
            <div className="uk-margin">
              <textarea
                className="uk-textarea"
                rows="5"
                placeholder="Description"
                aria-label="Description"
              />
            </div>
          </form>
          <p className="uk-text-right">
            <button
              className="uk-button uk-button-default uk-modal-close uk-margin-small-right"
              type="button"
            >
              Отменить
            </button>
            <button
              className="uk-button uk-button-primary uk-modal-close"
              type="button"
            >
              Применить
            </button>
          </p>
        </div>
      </div>
    );
  }
}
