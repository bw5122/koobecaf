import React, {Component} from 'react';
import io from "socket.io-client";
import {render} from 'react-dom'
import {Launcher} from './react-chat-window/lib/index'

class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: [],
            chatID: 'd0e50f1e-3fab-4287-ac27-9e572e26422f',
            socket: ""
        };
        console.log("constrcutor of chatroom: " + this.state.chatID);
    }

    loadChatHistory(message) {
        console.log("update msg");
        for(let i=0; i<message.length; i++){
          if(message[i].sender == '1')
            message[i].author = "me";
          else {
            message[i].author = "them;"
          }
          message[i].data = JSON.parse(message[i].data);
        }
        console.log(message);
        this.setState({
            //messageList: [...this.state.messageList, ...message]
            messageList: message
        })
    }

    updateMsg(message){
      console.log("update message");
      console.log(message);
      if(message.sender == undefined){

      }
      else if(message.sender == '1'){
        message.author = "me";
        console.log("me");
      }
      else {
        message.author = "them"
      }
      this.setState({
          messageList: [...this.state.messageList, message]
      })
    }

    _onMessageWasSent(message) {
        message.chatID = this.state.chatID;
        this.updateMsg(message);
        message['sender'] = this.props.userID;
        console.log("client: ");
        console.log(message);
        delete message['author'];
        this.state.socket.emit('message', message);
    }

    createSocket() {
        this.state.socket = io("http://localhost:5000", {
            query: {
                chatID: this.state.chatID,
            },
        });
    }

    componentDidMount() {
        this.createSocket();
        const socket = this.state.socket;
        console.log('join room: ' + this.state.chatID);
        socket.on('history', (data) =>{
            console.log("client: history activated");
            console.log(data);
            this.loadChatHistory(data.history);
        })

        socket.on('message', (message) => {
            console.log('message event is received at the front-end!');
            console.log(message.data);
            console.log(JSON.parse(message.data));
            message.data = JSON.parse(message.data);
            this.updateMsg(message);
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        const {
            chatHistory
        } = this.state;
        return ( <
            Launcher agentProfile = {
                {
                    teamName: 'react-live-chat',
                    imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
                }
            }
            onMessageWasSent = {
                this._onMessageWasSent.bind(this)
            }
            messageList = {
                this.state.messageList
            }
            showEmoji /
            >
        );
    }
}

export default Chatroom;

/*


<div class="chat-popup" id="myForm">
  <h1>Chat</h1>
  <label for="msg"><b>Message</b></label>
  <textarea placeholder="Type message.." name="msg" required></textarea>
  <button type="submit" class="btn">Send</button>
  <button type="button" class="btn cancel">Close</button>
</div>
*/
