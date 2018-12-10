import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ChatRoom from './ChatRoom'
import '../Styles/FriendList.css'



export default class FriendListRow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      renderChatRoom: false,
      chatID:''
    };
    this.renderChatRoom = this.renderChatRoom.bind(this);
  }

  renderChatRoom(){
    console.log("chatoom");
    if(this.state.renderChatRoom){
      this.setState({renderChatRoom: false});
      console.log("here");
    }
    this.setState({renderChatRoom: true});
  }

  render() {
      return(
        <ListItem alignItems="flex-start" onClick={this.renderChatRoom}>
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={this.props.friendInfo.photo} />
          </ListItemAvatar>
          <ListItemText
            primary={this.props.friendInfo.firstname}
          />
          <div className="chat-room">
            {(this.state.renderChatRoom)? <ChatRoom chatID={this.state.chatID} userInfo={this.props.userInfo}/> : ''}
          </div>
        </ListItem>
          )
  }
}

/*

secondary={
  <React.Fragment>
    <Typography component="span" className="inline" color="textPrimary">
      Ali Connors
    </Typography>
    {" — I'll be in your neighborhood doing errands this…"}
  </React.Fragment>
}

*/
