import React, {Component} from 'react';
import ChatRoom from './ChatRoom'
import '../Styles/FriendList.css'



export default class FriendList extends Component {

  constructor(props) {
    super(props);
    this.handleNewComment = this.handleNewComment.bind(this);
    this.state = {
      renderChatRoom: false,
      chatid: ''
    };
    this.a = this.a.bind(this);
  }

  handleNewComment = e =>{
    alert("Like");
  }

    a(chatid) {
      //  e.preventDefault();
        console.log("chatoom");
      //  alert("Chatroom!");
        if(this.state.renderChatRoom){
          this.setState({renderChatRoom: false});
          console.log("here");
        }
        this.setState({renderChatRoom: true, chatid: chatid});
    }

    b(chatid){
      if(this.state.renderChatRoom){
        this.setState({renderChatRoom: false});
        console.log("destructor");
      }
      console.log("constructor");
      this.setState({renderChatRoom: true, chatid: chatid});
    }

    render() {
        return(
            <div className="friend-list">
              <button className="_button_" onClick={() => this.a(1)}>Mary</button>
              <button className="_button_" onClick={() => this.b(2)}>Bob</button>
              <div className="chat-room">
                {(this.state.renderChatRoom)? <ChatRoom chatid={this.state.chatid}/> : ''}
              </div>
            </div>
            )
    }
}

//<button id="like_button" onClick={this.handleNewComment}>like</button>
//<button type="button" onClick="handleClick()">Mary</button>
//<button type="button" onClick={this.handleClick}>Jack</button>
