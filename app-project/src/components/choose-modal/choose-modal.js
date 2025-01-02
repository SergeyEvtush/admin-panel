import React from "react";

const ChooseModal = ({ target, data, redirect, bstoggle }) => {
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
    <div
      id={target}
      /* uk-modal={modal.toString()} container="false" */ className={
        `${bstoggle}` + " modal fade"
      }
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5">Открыть</h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Закрыть"
            ></button>
          </div>
          <div className="modal-body">
            {msg}
            <ul className="uk-list uk-list-divider">{pageList}</ul>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" type="button">
              Отменить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChooseModal;
