import React from "react";

const Notification = ({ type, message, active }) => {
  console.log(type, message);

  return (
    <div
      className={
        `alert alert-${type} alert-dismissible notification fade show ${active}`
          ? "active"
          : ""
      }
      role="alert"
    >
      <div>
        {message}
        {console.log(message)}
      </div>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
};
export default Notification;
