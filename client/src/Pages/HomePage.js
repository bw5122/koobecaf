import React, { Component } from "react";
import { Dimmer, Loader, Feed, Button } from "semantic-ui-react";
import Post from "../Components/Post";
import Navigationbar from "../Components/Navbar";
import FriendList from "../Components/FriendList";
import "../Styles/Home.css";
import GroupChatCreator from "../Components/GroupChatCreator";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // all fields limit length to 20 characters
      userInfo: this.props.location.state.userInfo,
      posts: [],
      newpost: "",
      friendtags: [],
      reqID: "",
      isLoading: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
    this.homeRef = React.createRef();
    this.updateHomePage = this.updateHomePage.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  handleSendFriendRequest(e) {
    e.preventDefault();
    fetch("/friend/sendfriendrequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender: this.state.userInfo.userID,
        receiver: this.state.reqID
      })
    })
      .then(res => res.json())
      .then(
        res => {
          alert("Friend request sent");
        },
        error => {
          console.log(error);
          alert("error (send friend requests)");
        }
      );
  }

  handleCreatePost = e => {
    e.preventDefault();
    const new_post = this.state.newpost;
    if (new_post.length === 0) {
      alert("Cannot create empty post. Please write something!");
      return;
    }
    //TODO: handle image
    fetch("/post/createpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "post",
        postBy: this.state.userInfo.userID,
        content: this.state.newpost,
        friendtags: this.state.friendtags
      })
    })
      .then(res => res.json())
      .then(
        res => {
          fetch("/post/getallpost/" + this.state.userInfo.userID, {
            method: "GET"
          })
            .then(res => res.json())
            .then(
              res => {
                this.setState({ posts: res.data });
                console.log(this.state.posts);
              },
              error => {
                console.log(error);
                alert("error (get all post)");
              }
            );
        },
        error => {
          alert("error (create posts)");
        }
      );
  };

  componentDidMount() {
    fetch("/post/getallpost/" + this.state.userInfo.userID, {
      method: "GET"
    })
      .then(res => res.json())
      .then(
        res => {
          this.setState({ posts: res.data, isLoading: false });
          console.log(this.state.posts);
        },
        error => {
          console.log(error);
          alert("error (get all post)");
        }
      );
  }

  updateHomePage() {
    this.setState({ isLoading: true });
    fetch("/post/getallpost/" + this.state.userInfo.userID, {
      method: "GET"
    })
      .then(res => res.json())
      .then(
        res => {
          this.setState({ posts: res.data, isLoading: false });
        },
        error => {
          console.log(error);
          alert("error (get all post)");
        }
      );
  }

  handleURL() {
    fetch("" + this.state.userInfo.userID, {
      method: "GET"
    })
      .then(res => res.json())
      .then(
        res => {

        },
        error => {

        }
      );
  }

  navigateToProfile() {}
  render() {
    const username = this.props.location.state.username;
    const posts = this.state.posts;
    const all_posts = posts.map(post => (
      <Post
        info={post}
        userInfo={this.state.userInfo}
        updateHomePage={this.updateHomePage}
      />
    ));

    return (
      <div className="homepage">
        <Navigationbar userInfo={this.state.userInfo} />
        <Dimmer active={this.state.isLoading} inverted>
          <Loader> Loading </Loader>
        </Dimmer>
        <div className="content">
          <h3>This is {this.state.userInfo.firstname} home page! </h3>
          <div className="posts">
            <form className="createpost" onSubmit={this.handleCreatePost}>
              <input
                type="text"
                name="newpost"
                placeholder="What's on your mind?"
                id="newpost"
                value={this.state.newpost.value}
                onChange={this.handleChange}
                maxLength="200"
              />
              <br />
              <input type="submit" id="create_button" value="Share" />
            </form>
            <div className="oldposts">
              {/* <div>{all_posts}</div> */}
              {all_posts}
            </div>
          </div>
        </div>
        <FriendList userInfo={this.state.userInfo} />
        <form
          className="temp"
          onSubmit={this.handleSendFriendRequest.bind(this)}
        >
          <input
            type="text"
            name="reqID"
            placeholder="Please input friend userID"
            value={this.state.reqID.value}
            onChange={this.handleChange}
          />
          <br />
          <input type="submit" id="req_button" value="Send Request" />
        </form>
        <Button color='red' onClick={this.handleURL}>Test</Button>
      </div>
    );
  }
}

//        <FriendList userInfo={this.state.userInfo}/>

/* not applied to the new strcutre this.props.info
<Post creator="User2" content="Wowwwww!!!" />
<Post creator="User3" content="Happy Thanksgiving!" />
<Post creator="User4" content="Happy Birthday!" />
<FriendList userInfo={this.state.userInfo}/>
*/
export default Home;
