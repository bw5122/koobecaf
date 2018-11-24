import React, {Component} from 'react';
import socketIOClient from "socket.io-client";

class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatHistory = '';
      endpoint = "http://localhost:3000";
    };
  }

  componentDidMount() {
    const {endpoint} = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("TODO", data => this.setState({response: data}));
  }

  submitMessage() {

  }

  render() {
    const {chatHistory} = this.state;
    return (
      //render chat history
    );
  }
}
