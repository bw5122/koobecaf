import React, {Component} from 'react';
import io from "socket.io-client";
import {render} from 'react-dom'
import {Launcher} from './react-chat-window/lib/index'
import "../Styles/ChatRoom.css"

class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: [],
            chatID: this.props.chatID,
            socket: "",
            memberInfo:{}
        };
        console.log("constrcutor of chatroom: " + this.state.chatID);
    }

    getChatHistory(){
      console.log("get chat history");
      fetch("/chat/gethistory/" + this.state.chatID, {
        method: "GET",
      })
      .then(res => res.json())
      .then( res => {
        console.log("shit");
        if(res.err)
          alert("error: load chat history")
        else {
          this.loadChatHistory(res.data);
        }
      })
    }

    loadChatHistory(messages) {
        console.log("update msg");
        console.log(messages);
        let history = messages.history;

        this.setState({
          memberInfo: messages.members
        })
        for(let i=0; i<history.length; i++){
          if(history[i].sender == this.props.userInfo.userID)
            history[i].author = "me";
          else {
            history[i].author = "them";
          }
          history[i].firstname = (messages.members)[history[i].sender].firstname;
          history[i].data = JSON.parse(history[i].data);
        }
        this.setState({
            messageList: history
        })
    }

    updateMsg(message){
      console.log("update message");
      if(message.sender == this.props.userInfo.userID){
        message.author = "me";
      }
      else {
        message.author = "them";
      }
      console.log(this.state.memberInfo);
      message.firstname = (this.state.memberInfo)[message.sender].firstname;
      console.log(message);
      this.setState({
          messageList: [...this.state.messageList, message]
      })
      console.log("show msg list: ");
      console.log(this.state.messageList);
    }

    _onMessageWasSent(message) {
        message.chatID = this.state.chatID;
        message['sender'] = this.props.userInfo.userID;
        message['firstname'] = this.props.userInfo.firstname;
        this.updateMsg(message);
        console.log("client: ");
        console.log(message);
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
        this.getChatHistory();

        console.log('join room: ' + this.state.chatID);
      /*  socket.on('history', (data) =>{
            console.log("client: history activated");
            console.log(data);
            this.loadChatHistory(data);
        })*/

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
            Launcher className="chat-popup-window" agentProfile = {
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
            friendInfo = {
              this.props.friendInfo
            }
            chatID = {
              this.state.chatID
            }
            userInfo = {
              this.props.userInfo
            }
            showEmoji /
            >
        );
    }
}

export default Chatroom;
