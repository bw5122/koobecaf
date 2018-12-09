import React, {Component} from 'react';
import Image from 'react-image';
import Moment from 'react-moment';
import Comment from './Comment'
import '../Styles/Post.css';

class Post extends Component {
  constructor(props) {
    super(props);
    console.log(props.info.comments);
    this.state = {
      comments: props.info.comments,
      newcomment: '',
      likes: props.info.likes, // list of user names
      liked: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleNewComment = this.handleNewComment.bind(this);
    this.handleNewLike = this.handleNewLike.bind(this);
    this.handleShare = this.handleShare.bind(this);
  }

  componentDidMount() {
    const id = this.props.userInfo.userID;
    var b = false;
    this.state.likes.map(function(like_obj){
      if(like_obj.creator.userID == id) {
        b = true;
      }
    });
    this.setState({liked: b});
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
        creator: this.props.userInfo.userID
      })
    })
      .then(res => res.json())
      .then(
        (result) => {
          const id = result.data.creator;
          result.data.creator = {
            userID: id,
            firstname: this.props.userInfo.firstname,
            lastname: this.props.userInfo.lastname
          }
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

  handleDeleteComment(e) {
    //no data returned.
  }

  handleShare(e) {
    e.preventDefault();
    fetch("/post/createpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "share",
        postBy: this.props.userInfo.userID,
        postID: this.props.info.postID
      })
    })
    .then(res => res.json())
    .then(
      (res) => {
        this.props.updateHomePage();
        //console.log(this.state.post.size);
      },
      (error) => {
        alert("error (create posts)");
      }
    )
  }

  handleNewLike(e) {
    e.preventDefault();
    if(this.state.liked) {
      fetch("/post/unlikepost", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "like",
          postID: this.props.info.postID,
          creator: this.props.userInfo.userID
        })
      })
      .then(res => res.json())
      .then(
        (res) => {
          //remove user's like
          var new_arr = this.state.likes.filter((like_obj) =>
            like_obj.creator.userID !== this.props.userInfo.userID
          )
          this.setState({
            likes: new_arr,
            liked: !this.state.liked
          });
        },
        (error) => {
          alert("error (unlike)");
        }
      )
    } else {
      fetch("/post/likepost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "like",
          postID: this.props.info.postID,
          creator: this.props.userInfo.userID
        })
      })
      .then(res => res.json())
      .then(
        (res) => {
          const id = res.data.creator;
          res.data.creator = {
            userID: id,
            firstname: this.props.userInfo.firstname,
            lastname: this.props.userInfo.lastname
          }
          this.setState({
            likes: [res.data, ...this.state.likes],
            liked: !this.state.liked
          });
          //console.log(this.state.post.size);
        },
        (error) => {
          alert("error (new like)");
        }
      )
    }

  }

  generateHeader() {
    switch (this.props.info.type) {
      case "post":
        return <h3>{this.props.info.postBy.firstname} {this.props.info.postBy.lastname} posted:</h3>
        break;

      case "share":
      //TODO: /post/getonepost
        return <h3>{this.props.info.postBy.firstname} {this.props.info.postBy.lastname} shared:</h3>
        break;

      default:

    }
  }

  render() {
    const time = (this.props.info) ? (this.props.info).createdAt : '';
    const all_comments = (this.state.comments) ? this.state.comments.map((ele) =>
      <Comment info={ele} userInfo={this.props.userInfo}/>
    ) : [];
    console.log(this.state.likes);
    const header = this.generateHeader();
    return (
      <div className="box">
        {header}
        <Moment date={time} />
        <p>{this.props.info.content}</p>
        {this.state.likes.length > 0 &&
          <h4>{this.state.likes[0].creator.firstname} {this.state.likes[0].creator.lastname} and {this.state.likes.length - 1} friends like it</h4>
        }

        <button id="like_button" onClick={this.handleNewLike}>
          {this.state.liked ? 'unlike' : 'like'}
        </button>
        <button id="share_button" onClick={this.handleShare}>share</button>
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
