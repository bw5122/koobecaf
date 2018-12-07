import React, {Component} from 'react';
import Image from 'react-image';
import Moment from 'react-moment';
import Comment from './Comment'
import './Post.css';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: this.props.info.comments,
      newcomment: '',
      likes: {} // list of user names
    };
    this.handleNewComment = this.handleNewComment.bind(this);
    this.handleNewLike = this.handleNewLike.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleNewComment = e =>{
    e.preventDefault();
    fetch("/post/addcomment" + this.state.userID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        postID: this.props.info.postID,
        content: this.state.newcomment,
        creator: this.props.postBy
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState(prevState => ({
            comments: [...prevState.comments, result]
          }))
        },
        error => {
          alert("Error (add comment)! Please try again.");
        }
      );
  }

  handleDeleteComment = e => {
    //no data returned.
  }

  handleNewLike = e => {

  }

  render() {
    const time = this.props.info.createdAt;
    const comments = this.state.comments.map((ele) =>
      <Comment info={ele} />
    );
    return (
      <div className="box">
        <h3>{this.props.info.creator}</h3>
        <Moment date={time} />
        <p>{this.props.info.content}</p>
        <button id="like_button" onClick={this.handleNewLike}>like</button>
        <ul id="comment_list">{comments}</ul>
        <form className="createcomment" onSubmit={this.handleNewComment}>
          <input type="text" placeholder="Write a comment..." id="newcomment" value={this.state.newcomment.value}  onChange={this.handleChange} maxLength="100" />
          <input type="submit" id="comment_button" value="Comment" />
        </form>
      </div>
    );
  }
}

export default Post;
