import React, {Component} from 'react';

class Navbar extends Component {
  // props: {userInfo}
  constructor(props) {
    super(props);
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
  }

  handleFriendRequests = e => {
    e.preventDefault();
  }

  render() {

    return (
      <div className="nav">
        <button id="profile_button" onClick={this.navigateToProfile}>{this.props.userInfo.firstname}</button>
        <button id="home_button" onClick={this.navigateToHome}>Home</button>
        <button id="notify_button" onClick="">Notifications</button>
        <button id="friends_button" onClick="">Friends</button>
      </div>
    );
  }
}

export default Navbar;
