import React from "react";
import Button from "react-bootstrap/Button";
const Panel = () => {
  return (
    <div className="d-flex justify-content-end align-items-center p-3 panel">
      <Button
        className="me-1"
        variant="primary"
        type="button"
        data-bs-target="#modal-open"
        data-bs-toggle="modal"
      >
        Открыть
      </Button>
      <Button
        className="me-1"
        variant="primary"
        type="button"
        data-bs-target="#modal-save"
        data-bs-toggle="modal"
      >
        Опубликовать
      </Button>
      <Button
        className="me-1"
        variant="primary"
        type="button"
        data-bs-target="#modal-meta"
        data-bs-toggle="modal"
      >
        Редактировать Мета
      </Button>
      <Button
        className="me-1"
        variant="primary"
        type="button"
        data-bs-target="#modal-backup"
        data-bs-toggle="modal"
      >
        Восстановить
      </Button>
    </div>
  );
};
export default Panel;
