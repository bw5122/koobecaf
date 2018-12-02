import React, {Component} from 'react';
import socketIOClient from "socket.io-client";

function Message(props) {
  // props : {sender username, message content}
  return (
    <li>
      <div className="senderID">
        {this.props.sender}
      </div>
      <div className="message">
        {this.props.message}
      </div>
    </li>
  )
}

class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatHistory : {},
      endpoint : "http://localhost:3000"
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
      <div>
      <h1>Chat</h1>
      <ul className="message-list">
        {this.state.chatHistory.map(message => {
          return <Message sender={message.sender} message={message.content} />
        })}
      </ul>
      </div>
    );
  }
}

export default Chatroom;
