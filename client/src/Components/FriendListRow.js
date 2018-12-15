import React, {Component} from 'react';
import { Redirect, withRouter } from "react-router-dom";
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


class FriendListRow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      renderChatRoom: false,
    };
    this.renderChatRoom = this.renderChatRoom.bind(this);
    this.visitProfile = this.visitProfile.bind(this);
  }

  renderChatRoom(){
    this.props.handleChatRoomRender(this.props.friendInfo.chatID);
  }

  visitProfile = e => {
    e.preventDefault();
    this.props.history.push({
      pathname: "/profile",
      state: {
        userInfo: this.props.friendInfo,
        visitor: this.props.userInfo
      }
    });
  };

  render() {
      console.log("render friendlist row");
      return(
        <ListItem alignItems="flex-start" >
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={this.props.friendInfo.photo} onClick={this.renderChatRoom} />
          </ListItemAvatar>
          <ListItemText onClick={this.visitProfile}
            primary={this.props.friendInfo.firstname}
          />
          <div className="chat-room">
            {(this.props.allowRenderChatRoom)? <ChatRoom friendInfo={this.props.friendInfo} chatID={this.props.friendInfo.chatID} userInfo={this.props.userInfo}/> : ''}
          </div>
        </ListItem>
          )
  }
}

export default withRouter(FriendListRow);
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
