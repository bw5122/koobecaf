import React, {Component} from 'react';
import io from "socket.io-client";
import {render} from 'react-dom'
import {Launcher} from './react-chat-window/lib/index'

class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: [],
            chatID: this.props.chatID,
            socket: ""
        };
        console.log("constrcutor of chatroom: " + this.state.chatID);
    }

    updateMsg(message) {
        if(message.senderID == this.state.chatID)
          message.author = "me";
        else {
          message.author = "them;"
        }
        this.setState({
            messageList: [...this.state.messageList, message]
        })
    }

    _onMessageWasSent(message) {
        /*var testMsg = {
            chatid: '',
            senderid: '',
            author: 'them',
            type: 'emoji',
            data: {
                code: 'hello world'
            }
        };*/
        message.chatID = this.state.chatID;
        //this.updateMsg(message);
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
        /*  socket.emit('joinRoom', this.state.chatid); //拉好友列表的时候把chatID一起拉回来
          socket.on('login', (o)=>{
              console.log('login event is received at the front-end!')
              this.updateSysMsg(o, 'login');
          })
          socket.on('logout', (o)=>{
              this.updateSysMsg(o, 'logout');
          }) */
        socket.on('message', (message) => {
            console.log('message event is received at the front-end!');
            console.log(message.data);
            console.log(JSON.parse(message.data));
            message.data = JSON.parse(message.data);
            this.updateMsg(message);
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.chatID != this.props.chatID)
            this.setState({
                chatID: this.props.chatID
            })
        this.createSocket();
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
