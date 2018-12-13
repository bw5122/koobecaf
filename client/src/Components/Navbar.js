import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { Dropdown, Button, Icon, Menu, Input, Sticky } from "semantic-ui-react";
import Notification from "../Components/Notification";
import FriendRequest from "../Components/FriendRequest";
import FriendSearchBar from "../Components/FriendSearchBar";
import "../Styles/Navbar.css";

class Navigationbar extends Component {
  // props: {userInfo}
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.userInfo,
      notifications: [],
      requests: [],
    };
    this.navigateToHome = this.navigateToHome.bind(this);
    this.navigateToProfile = this.navigateToProfile.bind(this);
    this.handleNotify = this.handleNotify.bind(this);
    this.handleFriendRequests = this.handleFriendRequests.bind(this);
    this.updateFriendRequests = this.updateFriendRequests.bind(this);
  }

  navigateToHome = e => {
    e.preventDefault();
    this.props.history.push({
      pathname: "/home",
      state: {
        userInfo: this.props.userInfo
      }
    });
  };

  navigateToProfile = e => {
    e.preventDefault();
    this.props.history.push({
      pathname: "/profile",
      state: {
        userInfo: this.props.userInfo
      }
    });
  };

  handleNotify = e => {
    e.preventDefault();
    fetch("/user/getnotice/" + this.state.userInfo.userID, {
      method: "GET"
    })
      .then(res => res.json())
      .then(
        result => {
          // check if any field is undefined before display
          this.setState({ notifications: result.data });
        },
        error => {
          alert("Error (get notifications)! Please try again.");
        }
      );
  };

  handleFriendRequests = e => {
    e.preventDefault();
    fetch("/friend/getfriendrequest/" + this.state.userInfo.userID, {
      method: "GET"
    })
      .then(res => res.json())
      .then(
        result => {
          // check if any field is undefined before display
          this.setState({ requests: result.data });
        },
        error => {
          alert("Error (get friend requests)! Please try again.");
        }
      );
  };

  handleLogout = e => {
    e.preventDefault();
    fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: this.state.userInfo.userID
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.props.history.push({
            pathname: "/"
          });
        },
        error => {
          alert("Error (log out)! Please try again.");
        }
      );
  };

  updateFriendRequests() {
    fetch("/friend/getfriendrequest/" + this.state.userInfo.userID, {
      method: "GET"
    })
      .then(res => res.json())
      .then(
        result => {
          // check if any field is undefined before display
          this.setState({ requests: result.data });
        },
        error => {
          alert("Error (get friend requests)! Please try again.");
        }
      );
  }

  render() {
    return (
      <Sticky>
      <Menu color="brown" inverted width={3}>
        <Menu.Item>
          <Button
            circular
            onClick={this.navigateToProfile}
            icon="user outline"
          />
        </Menu.Item>

        <Menu.Item>
          <Button id="home_button" onClick={this.navigateToHome} icon="home" />
        </Menu.Item>

        <Menu.Item>
          <Dropdown
            text="Notifications"
            icon="bell outline"
            labeled
            button
            id="notify_button"
            className="icon"
            onClick={this.handleNotify}
          >
            <Dropdown.Menu>
              <Dropdown.Header content="New Notifications" />
              {this.state.notifications !== null &&
                this.state.notifications.map(option => (
                <Dropdown.Item key={option.noticeID}>
                  <Notification info={option} userInfo={this.state.userInfo} />{" "}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>

        <Menu.Item>
          <Dropdown
            button
            icon="heart"
            text="Friend Requests"
            floating
            labeled
            id="friend_button"
            className="icon"
            onClick={this.handleFriendRequests}
          >
            <Dropdown.Menu>
              <Dropdown.Header content="New Friend Requests" />
              {this.state.requests.map(option => (
                <Dropdown.Item key={option.noticeID}>
                  <FriendRequest info={option} userInfo={this.state.userInfo} />{" "}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>

        <Menu.Item position="right">
          <Button
            id="logout_button"
            onClick={this.handleLogout}
            icon="log out"
          />
        </Menu.Item>

        <Menu.Item position="left">
          <FriendSearchBar userInfo={this.state.userInfo} />
        </Menu.Item>
      </Menu>
      </Sticky>
    );
  }
}

export default withRouter(Navigationbar);
