import React, {Component} from 'react';
import ChatRoom from './ChatRoom'
import '../Styles/FriendList.css'



export default class FriendList extends Component {

  constructor(props) {
    super(props);
    this.handleNewComment = this.handleNewComment.bind(this);
    this.state = {
      renderChatRoom: false,
      chatID: ''
    };
    this.a = this.a.bind(this);
  }

  handleNewComment = e =>{
    alert("Like");
  }

    a() {
      //  e.preventDefault();
        console.log("chatoom");
      //  alert("Chatroom!");
        if(this.state.renderChatRoom){
          this.setState({renderChatRoom: false});
          console.log("here");
        }
        this.setState({renderChatRoom: true});
    }

    render() {
        return(
            <div className="friend-list">
              <button className="_button_" onClick={() => this.a()}>Mary</button>
              <button className="_button_" onClick={() => this.a()}>Bob</button>
              <div className="chat-room">
                {(this.state.renderChatRoom)? <ChatRoom chatID={this.state.chatID} userInfo={this.props.userInfo}/> : ''}
              </div>
            </div>
            )
    }
}

//<button id="like_button" onClick={this.handleNewComment}>like</button>
//<button type="button" onClick="handleClick()">Mary</button>
//<button type="button" onClick={this.handleClick}>Jack</button>
