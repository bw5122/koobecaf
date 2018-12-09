import React, {Component} from 'react';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.userID,
    };
  }

  render() {
    return (
      <p>{this.state.userID} : {this.props.info.content}</p>
    );
  }
}

export default Comment;
