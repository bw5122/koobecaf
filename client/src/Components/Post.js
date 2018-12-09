import React, {Component} from 'react';
import Image from 'react-image';
import Moment from 'react-moment';
import Comment from './Comment'
import '../Styles/Post.css';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      newcomment: '',
      likes: {}, // list of user names
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleNewComment = this.handleNewComment.bind(this);
    this.handleNewLike = this.handleNewLike.bind(this);
  }

  componentDidMount() {
    this.setState({
      comments: this.props.info.comments,
      userID: this.props.userID
    });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleNewComment = e =>{
    e.preventDefault();
    fetch("/post/addcomment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "comment",
        postID: this.props.info.postID,
        content: this.state.newcomment,
        creator: this.state.userID
      })
    })
      .then(res => res.json())
      .then(
        (result) => {
          if(this.state.comments) {
            this.setState({
              comments: [...this.state.comments, result.data]
            });
          } else {
            this.setState({
              comments: [result.data]
            });
          }

        },
        (error) => {
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
    const time = (this.props.info) ? (this.props.info).createdAt : '';
    const all_comments = (this.state.comments) ? this.state.comments.map((ele) =>
      <Comment info={ele} userID={this.state.userID}/>
    ) : [];
    return (
      <div className="box">
        <h3>{this.props.info.creator}</h3>
        <Moment date={time} />
        <p>{this.props.info.content}</p>
        <button id="like_button" onClick={this.handleNewLike}>like</button>
        <ul id="comment_list">{all_comments}</ul>
        <form className="createcomment" onSubmit={this.handleNewComment}>
          <input type="text" name="newcomment" placeholder="Write a comment..." id="newcomment" value={this.state.newcomment.value}  onChange={this.handleChange} maxLength="100" />
          <input type="submit" id="comment_button" value="Comment" />
        </form>
      </div>
    );
  }
}

export default Post;
