import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import FriendListRow from './FriendListRow'
import GroupChatCreator from './GroupChatCreator'
import GroupChatListRow from './GroupChatListRow'


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 250,
    top: '65px',
    bottom: '0px',
    backgroundColor: theme.palette.background.paper,
    position: 'fixed',
    right: '0%',
    overflow: 'auto',
    maxHeight: 700,
  },
  inline: {
    display: 'inline',
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
});


class FriendList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      groupChats: [],
      chatRoomID: '',
      friendInfoReady: false
    };
    this.handleChatRoomRender = this.handleChatRoomRender.bind(this);
    this.loadGroupChats = this.loadGroupChats.bind(this);
    this.loadFriendList = this.loadFriendList.bind(this);
    this.loadFriendList();
    this.loadGroupChats();
    console.log("friend list:", this.state.friends);
  }

  loadFriendList(){
    console.log("loadFriendList");
    fetch("/friend/getfriend/" + this.props.userInfo.userID, {
      method: "GET",
    })
    .then(res => res.json())
    .then( res => {
      console.log("shit");
      if(res.err)
        alert("error: load chat history")
      else {
        this.setState({
          friends: res.data,
          friendInfoReady: true
        })
        console.log("res.data: ", res.data);
      }
    })
  }

  loadGroupChats(){
    console.log("load group chats");
    fetch("/chat/getallgroupchat/" + this.props.userInfo.userID, {
      method: "GET",
    })
    .then(res => res.json())
    .then( res => {
      console.log("shit");
      if(res.err)
        alert("error: load chat history")
      else {
        console.log("res.data: ", res.data);
        this.setState({
          groupChats: res.data,
        })
      }
    })
  }

  /*componentWillReceiveProps(props) {
    this.loadFriendList();
  }*/

  handleChatRoomRender(chatID){
      this.setState({
          chatRoomID: chatID
      })
  }

  render() {
    const { classes } = this.props;
    const all_friends = this.state.friends.map((friend) =>
        <FriendListRow
          friendInfo={friend}
          userInfo={this.props.userInfo}
          handleChatRoomRender={this.handleChatRoomRender}
          allowRenderChatRoom = {(friend.chatID == this.state.chatRoomID)?true:false}
        />

    );
    //console.log("friend list:", this.state.friends);
    const all_groupchats = this.state.groupChats.map((chat) =>
        <GroupChatListRow
          chatInfo={chat}
          userInfo={this.props.userInfo}
          handleChatRoomRender={this.handleChatRoomRender}
          allowRenderChatRoom = {(chat.chatID == this.state.chatRoomID)?true:false}
        />

    );

    return(
      <div className={classes.root}>
        <List subheader={<li />}>
            <li key={`section-1`} className={classes.listSection}>
              <ul className={classes.ul}>
                <ListSubheader>{'Friends'}</ListSubheader>
                <div className="friend-list">
                <ul>{all_friends}</ul>
                </div>
              </ul>
            </li>
            <li key={`section-2`} className={classes.listSection}>
              <ul className={classes.ul}>
                <ListSubheader>{'Group Chats'}</ListSubheader>
                <div className="group-chat-list">
                <ul>{all_groupchats}</ul>
                </div>
              </ul>
            </li>
        </List>
        {(this.state.friendInfoReady) ? <GroupChatCreator className={"group-chat-creator"} userInfo={this.props.userInfo} friendsInfo={this.state.friends}
                                                        refreshChats={this.loadGroupChats}/> : ''}
      </div>
        )
    }
}
/*
<List className={classes.root}>
  <div className="friend-list">
  <ul>{all_friends}</ul>
  </div>
</List>*/
export default withStyles(styles)(FriendList);
