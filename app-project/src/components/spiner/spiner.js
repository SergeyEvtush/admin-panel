import React from "react";
import { Spinner } from "react-bootstrap";

const Spiner = ({ active }) => {
  return (
    <div className={active ? "spiner active" : "spiner"}>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
};
export default Spiner;
