import React from "react";

const Notification = ({ notification }) => {
  return (
    <div
      className={`alert alert-${notification.type} alert-dismissible notification`}
      role="alert"
      show={notification.show}
    >
      <div>{notification.message}</div>
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
