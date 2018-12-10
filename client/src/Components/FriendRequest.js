import React, { Component } from "react";

class FriendRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.userInfo
    }
  }

  handleAccept(e) {
    e.preventDefault();
  }

  handleDeny(e) {
    e.preventDefault();
  }

  render() {

  }
}

export default FriendRequest;
