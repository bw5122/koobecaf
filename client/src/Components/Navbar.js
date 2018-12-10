import React, {Component} from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Dropdown, Button, Icon} from 'semantic-ui-react'
import Notification from '../Components/Notification'
import FriendRequest from '../Components/FriendRequest'

class Navigationbar extends Component {
  // props: {userInfo}
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.userInfo,
      notifications: [],
      requests: []
    }
    this.navigateToHome = this.navigateToHome.bind(this);
    this.navigateToProfile = this.navigateToProfile.bind(this);
    this.handleNotify = this.handleNotify.bind(this);
    this.handleFriendRequests = this.handleFriendRequests.bind(this);
    this.updateFriendRequests = this.updateFriendRequests.bind(this);
  }

  navigateToHome = e => {
    e.preventDefault();
    this.props.history.push({
      pathname:"/home",
      state: {
        userInfo: this.props.userInfo
      }
    });
  }

  navigateToProfile = e => {
    e.preventDefault();
    this.props.history.push({
      pathname:"/profile",
      state: {
        userInfo: this.props.userInfo
      }
    });
  }

  handleNotify = e => {
    e.preventDefault();
    fetch("/notice/getnotice/" + this.state.userInfo.userID, {
      method: "GET",
    })
    .then(res => res.json())
    .then(
      (result) => {
        // check if any field is undefined before display
        this.setState({notifications: result.data});
      },
      (error) => {
        alert("Error (get notifications)! Please try again.");
      }
    )
  }

  handleFriendRequests = e => {
    e.preventDefault();
    fetch("/friend/getfriendrequest/" + this.state.userInfo.userID, {
      method: "GET",
    })
    .then(res => res.json())
    .then(
      (result) => {
        // check if any field is undefined before display
        this.setState({requests: result.data});
      },
      (error) => {
        alert("Error (get friend requests)! Please try again.");
      }
    )
  }

  updateFriendRequests() {
    fetch("/friend/getfriendrequest/" + this.state.userInfo.userID, {
      method: "GET",
    })
    .then(res => res.json())
    .then(
      (result) => {
        // check if any field is undefined before display
        this.setState({requests: result.data});
      },
      (error) => {
        alert("Error (get friend requests)! Please try again.");
      }
    )
  }

  render() {

    return (

      <div className="nav" display="hidden">
        <button id="profile_button" onClick={this.navigateToProfile}>{this.props.userInfo.firstname}</button>
        <button id="home_button" onClick={this.navigateToHome}>Home</button>

        <Button animated='vertical' onClick={this.navigateToHome}>
          <Button.Content hidden>Home</Button.Content>
          <Button.Content visible>
            <Icon name='home' />
          </Button.Content>
        </Button>
        <Dropdown text='Notifications ' icon='bell outline' labeled button className='notify_button' onClick={this.handleNotify}>
          <Dropdown.Menu>
            <Dropdown.Header content='New Notifications' />
            {this.state.notifications.map(option => <Dropdown.Item key={option.noticeID}>
              <Notification info={option} userInfo={this.state.userInfo} /> </Dropdown.Item>)}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown text='Friend Requests ' icon='male' labeled button className='friend_button' onClick={this.handleFriendRequests}>
          <Dropdown.Menu>
            <Dropdown.Header content='New Friend Requests' />
            {this.state.requests.map(option => <Dropdown.Item key={option.noticeID}>
              <FriendRequest info={option} userInfo={this.state.userInfo} update={this.updateFriendRequests}/> </Dropdown.Item>)}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

export default withRouter(Navigationbar);
