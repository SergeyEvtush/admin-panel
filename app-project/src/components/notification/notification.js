import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
export default class Notification extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { variant, text, show } = this.props.prop;

    return (
      <Alert variant={variant} show={show}>
        <Alert.Heading className="text-center">{text}</Alert.Heading>
      </Alert>
    );
  }
}
