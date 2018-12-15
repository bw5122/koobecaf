import React, { Component } from "react";
import { List, Image, Feed } from "semantic-ui-react";
import default_profile from "../Assets/profile.png";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.userInfo,
      info: this.props.info
    };
  }

  render() {
    var summary;
    switch (this.props.info.type) {
      case "public_new_profile":
        summary =
          this.props.info.sender.gender == "F"
            ? "updated her profile."
            : "updated his profile.";
        break;
      case "public_new_status":
        summary = "posted an update.";
        break;
      case "public_new_photo":
        summary =
          this.props.info.sender.gender == "F"
            ? "updated her profile photo."
            : "updated his profile photo.";
        break;
      case "public_new_share":
        summary = "shared a post.";
        break;
      case "private_new_message":
        summary = "sent you a new message.";
        break;
      case "private_new_friend":
        summary = "became your friend.";
        break;
      case "private_deny_friend":
        summary = "rejected your friend request.";
        break;
      case "private_new_like":
        summary = "liked your post.";
        break;
      case "private_new_comment":
        summary = "commented on your post.";
        break;
      default:
        break;
    }
    return (
      <Feed>
        <Feed.Event>
          <Feed.Label image={this.props.info.sender.photo || default_profile} />
          <Feed.Content
            date={new Date(this.props.info.createdAt).toLocaleString()}
            summary={summary}
          />
        </Feed.Event>
      </Feed>
    );
    if (this.props.info.type === "public_new_profile") {
      return <p> xxx updated his / her profile </p>;
    } else if (this.props.info.type === "public_new_status") {
      return <p> xxx posted an update </p>;
    } else if (this.props.info.type === "public_new_photo") {
      return <p> xxx updated his / her profile photo </p>;
    } else if (this.props.info.type === "public_new_share") {
      return <p> xxx shared a post </p>;
    } else if (this.props.info.type === "private_new_message") {
      return <p> You have new message </p>;
    } else if (this.props.info.type === "private_new_friend") {
      return <p> You have a new friend </p>;
    } else if (this.props.info.type === "private_deny_friend") {
      return <p> xxx does not want to be friend with you </p>;
    } else if (this.props.info.type === "private_new_like") {
      return <p> xxx liked your post </p>;
    } else if (this.props.info.type === "private_new_comment") {
      return <p> xxx commented on your posts </p>;
    } else {
      return <p> No new nofication </p>;
    }
  }
}

export default Notification;
