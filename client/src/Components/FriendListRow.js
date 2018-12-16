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
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ChatRoom from './ChatRoom';
import Icon from '@material-ui/core/Icon';
import AddIcon from '@material-ui/icons/Add';
import '../Styles/FriendList.css'


class FriendListRow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      renderChatRoom: false,
      anchorEl: null,
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

  handleDeleteFriend = e => {
    e.preventDefault();
    fetch("/friend/deletefriend", {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: this.props.userInfo.userID,
        objectID: this.props.friendInfo.userID
      })
    })
    .then(res => res.json())
    .then(res => {
      if(res.error){
        alert("error (delete friend)");
      } else {
        alert('you have one less friend')
        //TODO: UPDATE FRIEND LIST
      }
    });
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
      console.log("render friendlist row");
      const { anchorEl } = this.state;
      return(
        <ListItem alignItems="flex-start" >
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={this.props.friendInfo.photo} onClick={this.renderChatRoom} />
          </ListItemAvatar>
          <ListItemText onClick={this.visitProfile}
            primary={this.props.friendInfo.firstname}
          />
          <div>
            <Button
              aria-owns={anchorEl ? 'simple-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
            <AddIcon />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.visitProfile}>Profile</MenuItem>
              <MenuItem onClick={this.renderChatRoom}>ChatRoom</MenuItem>
              <MenuItem onClick={this.handleDeleteFriend}>Delete</MenuItem>
            </Menu>
          </div>
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
