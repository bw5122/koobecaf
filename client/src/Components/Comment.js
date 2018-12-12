import React, { Component } from "react";
import { Button, Comment, Form, Header } from "semantic-ui-react";

class Comment_Component extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.userInfo.userID
    };
  }

  render() {
    const time = new Date(this.props.info.createdAt).toLocaleString();
    return (
      <Comment>
        <Comment.Avatar src={this.props.info.creator.photo} />
        <Comment.Content style={{ marginTop: "0px" }}>
          <Comment.Author as="a">
            {this.props.info.creator.firstname}{" "}
            {this.props.info.creator.lastname}
          </Comment.Author>
          <Comment.Metadata>
            <div>{time}</div>
          </Comment.Metadata>
          <Comment.Text> {this.props.info.content}</Comment.Text>
        </Comment.Content>
      </Comment>
    );
    //<p>{this.props.info.creator.firstname} {this.props.info.creator.lastname} : {this.props.info.content}</p>
  }
}

export default Comment_Component;
