/* eslint-disable react/no-multi-comp */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';


const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
};

class SimpleDialog extends React.Component {
  state = {
    checked: [],
  };

  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  createGroupChat(){
    let membersInfo = this.state.checked;
    for(let i=0; i<membersInfo.length; i++)
      membersInfo[i] = membersInfo[i].userID;
    membersInfo.push(this.props.userInfo.userID);
    console.log("membersInfo", membersInfo);
    fetch("/chat/creategroupchat", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          members: membersInfo
      })
    })
    .then(res => res.json())
    .then( res => {
      console.log("group chat is created!");
    })
    this.handleListItemClick();
  }

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Choose friends to join the group chat</DialogTitle>
        <div>
          <List>
            {this.props.friendsInfo.map(friend => (
              <ListItem button onClick={() => this.handleToggle(friend)} key={friend.userID}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={friend.firstname} />
                <ListItemSecondaryAction>
                  <Checkbox
                    onChange={this.handleToggle(friend)}
                    checked={this.state.checked.indexOf(friend) !== -1}
                  />
                </ListItemSecondaryAction>
              </ListItem>

            ))}
            <ListItem button onClick={() => this.createGroupChat()}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="create group chat" />
            </ListItem>
          </List>
        </div>
      </Dialog>
    );
  }
}

SimpleDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog);

class GroupChatCreator extends React.Component {
  state = {
    open: false,
    selectedValue: emails[1]
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = value => {
    this.setState({ selectedValue: value, open: false });
  };

  render() {
    console.log("GroupChatCreator:", this.props.friendsInfo);
    return (
      <div>
        <Typography variant="subtitle1">Selected: {this.state.selectedValue}</Typography>
        <br />
        <Button onClick={this.handleClickOpen}>Open simple dialog</Button>
        <SimpleDialogWrapped
          selectedValue={this.state.selectedValue}
          open={this.state.open}
          onClose={this.handleClose}
          friendsInfo={this.props.friendsInfo}
          userInfo={this.props.userInfo}
        />
      </div>
    );
  }
}


//s{this.state.open}
export default GroupChatCreator;
