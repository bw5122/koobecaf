import React, { Component } from "react";
import { Button } from "semantic-ui-react";

class FriendVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.userInfo
    };
  }
  showVisualizer() {
    fetch("/friend/visualizer", {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {}, error => {});
  }
  render() {
    return <Button onClick={this.showVisualizer}>Click</Button>;
  }
}

export default FriendVisualizer;
