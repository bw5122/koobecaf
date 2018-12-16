import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { List, Image } from 'semantic-ui-react';


class FriendRecommendation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.userInfo
    }
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
        alert('you have recommendations');
      }
    });
  }

  render() {
    return(
      <p>potential new friends</p>
    )
  }
}

export default withRouter(FriendRecommendation);
