import React, { Component } from "react";
import { Button } from 'semantic-ui-react'

class FriendRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.userInfo,
      info: this.props.info
    }
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDeny = this.handleDeny.bind(this);
  }

  handleAccept(e) {
    e.preventDefault();
    fetch("/friend/acceptfriend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        noticeID: this.state.info.noticeID,
        receiver: this.state.info.receiver,
        sender: this.state.info.sender.userID
      })
    })
    .then(res => res.json())
    .then(
      (res) => {
        alert('You have a new friend!')
      },
      (error) => {
        console.log(error);
        alert("error (accept friend)");
      }
    )
  }

  handleDeny(e) {
    e.preventDefault();
    fetch("/friend/denyfriend", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        noticeID: this.state.info.noticeID,
        receiver: this.state.info.receiver,
        sender: this.state.info.sender.userID
      })
    })
    .then(res => res.json())
    .then(
      (res) => {
      
      },
      (error) => {
        console.log(error);
        alert("error (deny friend)");
      }
    )
  }

  render() {
    return(
      <div>
      <p>{this.state.info.sender.firstname} {this.state.info.sender.lastname} wants to be friend with you</p>
      <Button primary onClick={this.handleAccept}>Accept</Button>
      <Button secondary onClick={this.handleDeny}>Deny</Button>
      </div>
    )
  }
}

export default FriendRequest;
