import React from "react";
const ConfirmModal = ({ target, method }) => {
  return (
    <div id={target} className="modal fade ">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Сохранение</h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Закрыть"
            ></button>
          </div>
          <div className="modal-body">
            <p>Уверены что хотите сохранить изменения</p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Отменить
            </button>
            <button
              data-bs-dismiss="modal"
              type="button"
              className="btn btn-primary me-1"
              variant="primary"
              onClick={() => method()}
            >
              Опубликовать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConfirmModal;
