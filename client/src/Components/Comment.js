import React, {Component} from 'react';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <p>{this.props.info.content}</p>
    );
  }
}

export default Comment;
