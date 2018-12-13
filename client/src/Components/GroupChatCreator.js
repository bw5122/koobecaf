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
import TextField from '@material-ui/core/TextField';


const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
};

class GroupChatCreationPage2 extends React.Component{
  constructor(props){
      super(props);
      console.log("load page 2")
      this.state = {
        name: ""
      };
  }

  handleClose = () => {
    this.props.onClose();
  };

  createGroupChat(){
    let membersInfo = this.props.selectedValues;
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
          members: membersInfo,
          name: this.state.name
      })
    })
    .then(res => res.json())
    .then( res => {
      console.log("group chat is created!", res, this.props.friendsInfo);
      this.props.refreshChats();
    })
    this.setState({
      name: ''
    });
    this.handleClose();
  }

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    console.log("handle toggle")
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  handleChange = name => event => {
    this.setState({
      name: event.target.value,
    });
  };


  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Enter the group chat name</DialogTitle>
        <div>
          <List>
            <TextField
              id="standard-name"
              label="Input group chat name"
              className="input-field-name"
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
            />
            <ListItem button onClick={() => this.createGroupChat()}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Create Group Chat" />
            </ListItem>
          </List>
        </div>
      </Dialog>
    );
  }
}

class GroupChatCreationPage1 extends React.Component {
  constructor(props){
      super(props);
      console.log("loading simple dialog")
      this.state = {
        checked: [],
      };
  }

  handleClose = () => {
    this.props.onClose("");
  };

  handleNextStep(){
    let data = this.state.checked;
    this.setState({
      checked: []
    })
    this.props.onClose(data);
  }

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    console.log("handle toggle")
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
              <ListItem button onClick={this.handleToggle(friend)} key={friend.userID}>
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
            <ListItem button onClick={() => this.handleNextStep()}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Next Step" />
            </ListItem>
          </List>
        </div>
      </Dialog>
    );
  }
}

const GroupChatCreationPage1Wrapped = withStyles(styles)(GroupChatCreationPage1);
const GroupChatCreationPage2Wrapped = withStyles(styles)(GroupChatCreationPage2);


class GroupChatCreator extends React.Component {
  constructor(props){
      super(props);
      console.log("loading group chat creator")
      this.state = {
        open1: false,
        open2: false,
        selectedValues: []
      };
  }

  handleClickOpen = () => {
    this.setState({
      open1: true,
    });
  };

  handleClose1 = value => {
    console.log(value);
    this.setState({
      open1: false,
      open2: true,
      selectedValues: value
    });
  };

  handleClose2 = () => {
    this.setState({open2: false})
  };

  render() {
    return (
      <div>
        <br />
        <Button onClick={this.handleClickOpen}>Create Group Chat</Button>
        <GroupChatCreationPage1Wrapped
          open={this.state.open1}
          onClose={this.handleClose1}
          friendsInfo={this.props.friendsInfo}
        />
        <GroupChatCreationPage2Wrapped
            selectedValues={this.state.selectedValues}
            open={this.state.open2}
            onClose={this.handleClose2}
            userInfo={this.props.userInfo}
            refreshChats={this.props.refreshChats}
        />
      </div>
    );
  }
}


//s{this.state.open}
export default GroupChatCreator;
