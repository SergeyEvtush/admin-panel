import React from "react";

const ChooseModal = ({ modal, target, data, redirect }) => {
  const pageList = data.map((item) => {
    if (item.time) {
      return (
        <li key={item.file}>
          <a
            onClick={(e) => redirect(e, item.file)}
            className="uk-link-muted uk-modal-close"
            href="#"
          >
            Резервная копия от{item.time}
          </a>
        </li>
      );
    } else {
      return (
        <li key={item}>
          <a
            onClick={(e) => redirect(e, item)}
            className="uk-link-muted uk-modal-close"
            href="#"
          >
            {item}
          </a>
        </li>
      );
    }
  });
  let msg;
  if (data.length < 1) {
    msg = "Резервных копий не найдено";
  }
  return (
    <div id={target} uk-modal={modal.toString()} container="false">
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Открыть</h2>
        {msg}
        <ul className="uk-list uk-list-divider">{pageList}</ul>
        <p className="uk-text-right">
          <button
            className="uk-button uk-button-default uk-modal-close uk-margin-small-right"
            type="button"
          >
            Отменить
          </button>
        </p>
      </div>
    </div>
  );
};
export default ChooseModal;
