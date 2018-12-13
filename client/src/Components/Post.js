import React, { Component } from "react";
import {
  Button,
  Icon,
  Comment,
  Header,
  Form,
  TextArea,
  Feed,
  Segment
} from "semantic-ui-react";
import Image from "react-image";
import Moment from "react-moment";
import CommentComponent from "./Comment";
import "../Styles/Post.css";

class Post extends Component {
  constructor(props) {
    super(props);
    console.log(props.info.comments);
    this.state = {
      comments: props.info.comments,
      newcomment: "",
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
    this.state.likes.map(function(like_obj) {
      if (like_obj.creator.userID == id) {
        b = true;
      }
    });
    this.setState({
      liked: b
    });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleNewComment = e => {
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
        result => {
          const id = result.data.creator;
          result.data.creator = {
            userID: id,
            firstname: this.props.userInfo.firstname,
            lastname: this.props.userInfo.lastname,
            photo: this.props.userInfo.photo
          };
          if (this.state.comments) {
            this.setState({
              comments: [...this.state.comments, result.data]
            });
          } else {
            this.setState({
              comments: [result.data]
            });
          }
        },
        error => {
          alert("Error (add comment)! Please try again.");
        }
      );
  };

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
        content: this.props.info.content,
        postBy: this.props.userInfo.userID,
        postID: this.props.info.postID
      })
    })
      .then(res => res.json())
      .then(
        res => {
          this.props.updateHomePage();
          //console.log(this.state.post.size);
        },
        error => {
          alert("error (create posts)");
        }
      );
  }

  handleNewLike(e) {
    e.preventDefault();
    if (this.state.liked) {
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
          res => {
            //remove user's like
            var new_arr = this.state.likes.filter(
              like_obj => like_obj.creator.userID !== this.props.userInfo.userID
            );
            this.setState({
              likes: new_arr,
              liked: !this.state.liked
            });
          },
          error => {
            alert("error (unlike)");
          }
        );
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
          res => {
            const id = res.data.creator;
            res.data.creator = {
              userID: id,
              firstname: this.props.userInfo.firstname,
              lastname: this.props.userInfo.lastname
            };
            this.setState({
              likes: [res.data, ...this.state.likes],
              liked: !this.state.liked
            });
            //console.log(this.state.post.size);
          },
          error => {
            alert("error (new like)");
          }
        );
    }
  }

  generateHeader() {
    switch (this.props.info.type) {
      case "post":
        return <span>created a post</span>;
        break;

      case "share":
        //TODO: /post/getonepost
        return <span>shared a post</span>;
        break;

      default:
    }
  }

  render() {
    const time = this.props.info
      ? new Date(this.props.info.createdAt).toLocaleString()
      : "";
    const all_comments = this.state.comments
      ? this.state.comments.map(ele => (
          <CommentComponent info={ele} userInfo={this.props.userInfo} />
        ))
      : [];
    console.log(this.state.likes);
    const header = this.generateHeader();
    let image;
    if (this.props.info.image)
      image = (
        <a>
          <img src={this.props.info.image} alt={this.props.info.postID} />
        </a>
      );
    return (
      <div class="box">
        <Feed size="large">
          <Feed.Event>
            <Feed.Label image={this.props.info.postBy.photo} />
            <Feed.Content>
              <Feed.Summary>
                <Feed.User>
                  {this.props.info.postBy.firstname}{" "}
                  {this.props.info.postBy.lastname}
                </Feed.User>{" "}
                {header}
                <Feed.Date>{time}</Feed.Date>
              </Feed.Summary>
              <Feed.Extra text>{this.props.info.content}</Feed.Extra>
              <Feed.Extra images>{image}</Feed.Extra>
              <Feed.Meta>
                <Feed.Like>
                  <Icon name="like" />
                  {this.state.likes.length + " likes"}
                </Feed.Like>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>
          <Button id="like_button" onClick={this.handleNewLike}>
            {this.state.liked ? (
              <div>
                <Icon name="thumbs up" />
                <span>Unlike</span>
              </div>
            ) : (
              <div>
                <Icon name="thumbs up outline" />
                <span>like</span>
              </div>
            )}
          </Button>
          <Button id="share_button" onClick={this.handleShare}>
            <Icon name="share" /> Share
          </Button>
          <Button id="show_comment_button">
            <Icon name="comment" /> Comment
          </Button>
          <Comment.Group>
            <Header as="h3" dividing>
              Comments
            </Header>
            {all_comments}
            <Form className="createcomment" onSubmit={this.handleNewComment}>
              <Form.Field required>
                <TextArea
                  type="text"
                  name="newcomment"
                  placeholder="Write a comment..."
                  id="newcomment"
                  value={this.state.newcomment.value}
                  onChange={this.handleChange}
                  maxLength="100"
                  style={{ minHeight: 80, width: "90%", marginTop: "10px" }}
                />
              </Form.Field>
              <Button type="submit" id="comment_button" value="Comment" primary>
                <Icon name="edit" />
                Add Comment
              </Button>
            </Form>
          </Comment.Group>
        </Feed>
      </div>
    );
  }
}

export default Post;
