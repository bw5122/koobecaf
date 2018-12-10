import React, {Component} from 'react';
import { Redirect, withRouter } from 'react-router-dom';

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
    fetch("/getfriendrequest/" + this.state.userInfo.userID, {
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
        <button id="notify_button" onClick={this.handleNotify}>Notifications</button>
        <button id="friends_button" onClick={this.handleFriendRequests}>Friends</button>
      </div>
    );
  }
}

export default withRouter(Navigationbar);
