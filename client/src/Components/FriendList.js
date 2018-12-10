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

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 250,
    top: '50px',
    bottom: '0px',
    backgroundColor: theme.palette.background.paper,
    position: 'fixed',
    right: '0%',
    overflow: 'auto',
    maxHeight: 600,
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
      chatRoomID: ''
    };
    this.handleChatRoomRender = this.handleChatRoomRender.bind(this);
    this.loadFriendList();
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
          friends: res.data
        })
      }
    })
  }

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

    return(
      <List className={classes.root} subheader={<li />}>
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
              <ListSubheader>{'Group Chat'}</ListSubheader>
              {[0, 1, 2].map(item => (
                <ListItem key={`item-2-${item}`}>
                  <ListItemText primary={`Item ${item}`} />
                </ListItem>
              ))}
            </ul>
          </li>
      </List>

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
