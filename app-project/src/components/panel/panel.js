import React from "react";
const Panel = () => {
  return (
    <div className="panel">
      <button
        className="uk-button uk-button-primary uk-margin-small-right"
        type="button"
        uk-toggle="target: #modal-open"
      >
        Открыть
      </button>
      <button
        className="uk-button uk-button-primary uk-margin-small-right"
        type="button"
        uk-toggle="target: #modal-save"
      >
        Опубликовать
      </button>
      <button
        className="uk-button uk-button-primary uk-margin-small-right"
        type="button"
        uk-toggle="target: #modal-meta"
      >
        Редактировать Мета
      </button>
      <button
        className="uk-button uk-button-default"
        type="button"
        uk-toggle="target: #modal-backup"
      >
        Восстановить
      </button>
    </div>
  );
};
export default Panel;
