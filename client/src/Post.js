import React, {Component} from 'react';
import Image from 'react-image';
import './Post.css';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: {},
      newcomment: '',
      likes: {} // list of user names
    };
    this.handleNewComment = this.handleNewComment.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleNewComment = e =>{
    alert("Like");
  }

  render() {
    return (
      <div className="box">
        <h3>{this.props.creator}</h3>
        <p>{this.props.content}</p>
        <button id="like_button" onClick={this.handleNewComment}>like</button>
        <form className="createcomment" onSubmit={this.handleNewComment}>
          <input type="text" placeholder="Write a comment..." id="newcomment" value={this.state.newcomment.value}  onChange={this.handleChange} maxLength="100" />
          <input type="submit" id="comment_button" value="Comment" />
        </form>
      </div>
    );
  }
}

export default Post;
