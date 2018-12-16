import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { List, Image, Segment, Button } from 'semantic-ui-react';
import profile_default from "../Assets/profile.png";

class FriendRecommendation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.userInfo,
      friends: []
    }
    this.getFriendRecommendation = this.getFriendRecommendation.bind(this);
    this.handleAddFriend = this.handleAddFriend.bind(this);
  }

  componentDidMount() {
    fetch("/friend/generaterecommendation", {
      method: "get",
    })
    .then(res => res.json())
    .then(res => {
      if(res.error){
        alert("error (create recommendations)");
      } else {
        this.getFriendRecommendation();
      }
    });
  }

  getFriendRecommendation() {
    fetch("/friend/getrecommendation/" + this.state.userInfo.userID, {
      method: "get",
    })
    .then(res => res.json())
    .then(res => {
      if(res.error){
        alert("error (get friend recommendation)");
      } else {
        this.setState({
          friends: res.data
        })
      }
    });
  }

  handleAddFriend(e) {
    e.preventDefault();
    fetch("/friend/sendfriendrequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender: this.state.userInfo.userID,
        receiver: this.state.info.userID
      })
    })
    .then(res => res.json())
    .then(
      (res) => {
        alert("Friend request sent");
      },
      (error) => {
        console.log(error);
      }
    )
  }

  render() {
    return(
      <Segment style={{width:"20%"}}>
      <List>
        {this.state.friends.map(function(ele){
          let photo;
          if(ele.hasOwnProperty('photo')) {
            photo = ele.photo
          } else {
            photo = profile_default
          }
          return(
            <List.Item>
              <Image avatar src={photo} />
              <List.Content>
                <List.Header as='a'>{ele.firstname} {ele.lastname}</List.Header>
                
              </List.Content>
            </List.Item>
          )
        })}
      </List>
      </Segment>
    )
  }
}

export default withRouter(FriendRecommendation);
