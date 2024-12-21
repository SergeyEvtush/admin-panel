import React from "react";

const Spiner = ({ active }) => {
  return (
    <div className={active ? "spiner active" : "spiner"}>
      <div uk-spinner={active.toString()}></div>
    </div>
  );
};
export default Spiner;
