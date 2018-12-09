import React, {Component} from 'react';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.userInfo.userID,
    };
  }

  render() {
    return (
      <p>{this.props.info.creator.firstname} {this.props.info.creator.lastname} : {this.props.info.content}</p>
    );
  }
}

export default Comment;
