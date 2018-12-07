import React, {Component} from 'react';
import io from "socket.io-client";
import {render} from 'react-dom'
import {Launcher} from './react-chat-window/lib/index'
//import "./ChatRoom.css"

class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageList: [],
      chatid: this.props.chatid,
      socket:""
    };
    console.log("constrcutor of chatroom: "+this.state.chatid);
  }

  updateMsg(message){
    this.setState({
      messageList:[...this.state.messageList, message]
    })
  }

  _onMessageWasSent(message){
    var testMsg = {
      chatid: '',
      senderid: '',
      author: 'them',
      type: 'emoji',
      data: { code: 'hello world' }
    };
    message.chatid = this.state.chatid;
    this.state.socket.emit('message', message);
    this.updateMsg(message);
  }

  createSocket(){
      this.state.socket = io("http://localhost:3300", {
        query:{
          chatid: this.state.chatid,
        },
      });
  }

  componentDidMount() {
    this.createSocket();
    const socket = this.state.socket;
    console.log('join room: '+this.state.chatid);
  /*  socket.emit('joinRoom', this.state.chatid); //拉好友列表的时候把chatID一起拉回来
    socket.on('login', (o)=>{
        console.log('login event is received at the front-end!')
        this.updateSysMsg(o, 'login');
    })
    socket.on('logout', (o)=>{
        this.updateSysMsg(o, 'logout');
    }) */
    socket.on('message', (obj)=>{
        console.log('message event is received at the front-end!');
        this.updateMsg(obj);
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevState.chatid != this.props.chatid)
      this.setState({
        chatid: this.props.chatid
      })
    this.createSocket();
  }

  render() {
    const {chatHistory} = this.state;
    return (
      <Launcher
        agentProfile={{
          teamName: 'react-live-chat',
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={this.state.messageList}
        showEmoji
      />
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
