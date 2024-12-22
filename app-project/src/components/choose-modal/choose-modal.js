import React from "react";

const ChooseModal = ({ modal, target, data, redirect }) => {
  const pageList = data.map((item) => {
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
  });
  return (
    <div id={target} uk-modal={modal.toString()} container="false">
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Открыть</h2>
        <ul className="uk-list uk-list-divider">{pageList}</ul>
        <p className="uk-text-right">
          <button
            className="uk-button uk-button-default uk-modal-close"
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
