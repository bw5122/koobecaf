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



export default class GroupChatListRow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      renderChatRoom: false,
    };
    this.renderChatRoom = this.renderChatRoom.bind(this);
  }

  renderChatRoom(){
    this.props.handleChatRoomRender(this.props.chatInfo.chatID);
  }

  render() {
      console.log("render chat list row");
      return(
        <ListItem alignItems="flex-start" onClick={this.renderChatRoom}>
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={this.props.chatInfo.photo} />
          </ListItemAvatar>
          <ListItemText
            primary={this.props.chatInfo.name}
          />
          <div className="chat-room">
            {(this.props.allowRenderChatRoom)? <ChatRoom type={"group"} friendInfo={this.props.chatInfo} chatID={this.props.chatInfo.chatID} userInfo={this.props.userInfo}/> : ''}
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
