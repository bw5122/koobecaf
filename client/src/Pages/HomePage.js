import React, { Component } from "react";
import { Dimmer, Loader, Feed, Button, Form, Input } from "semantic-ui-react";
import Post from "../Components/Post";
import Navigationbar from "../Components/Navbar";
import FriendList from "../Components/FriendList";
import "../Styles/Home.css";
import GroupChatCreator from "../Components/GroupChatCreator";
import CreatePost from "../Components/CreatePost";
import FriendRecommendation from "../Components/FriendRecommendation";

const VisitorContext = React.createContext();

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
      isLoading: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
    this.homeRef = React.createRef();
    this.updateHomePage = this.updateHomePage.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
  }

  refreshPage() {
    fetch("/post/getallpost/" + this.state.userInfo.userID, {
      method: "GET"
    })
      .then(res => res.json())
      .then(res =>{
        if(res.error) {
          alert('error: refresh page')
        } else {
          this.setState({posts: res.data},
          () => console.log(this.state.posts))
        }
      });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
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
                this.setState({
                  posts: res.data
                });
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
          this.setState({
            posts: res.data,
            isLoading: false
          });
          console.log(this.state.posts);
        },
        error => {
          console.log(error);
          alert("error (get all post)");
        }
      );
      //this.interval = setInterval(() => this.refreshPage(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateHomePage() {
    this.setState({
      isLoading: true,
      posts: [],
    });
    fetch("/post/getallpost/" + this.state.userInfo.userID, {
      method: "GET"
    })
      .then(res => res.json())
      .then( res => {
        if(res.error) {
          console.log(res.error);
          alert("error (get all post)");
        } else {
          this.setState({
            posts: res.data,
            isLoading: false
          });
        }
      });

  }

  handleURL() {
    fetch("" + this.state.userInfo.userID, {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {}, error => {});
  }

  navigateToProfile() {}
  render() {
    var username = this.props.location.state.username;
    var posts = this.state.posts;
    var all_posts = posts.map(post => (
      <Post
        info={post}
        userInfo={this.state.userInfo}
        visitor={this.state.userInfo}
        updatePage={this.updateHomePage}
        own={post.postBy.userID === this.state.userInfo.userID}
      />
    ));
    return (
      <div className="homepage">

      <VisitorContext.Provider value={this.state.userInfo} >

        <Navigationbar userInfo={this.state.userInfo} />

        <Dimmer active={this.state.isLoading} inverted>
          <Loader> Loading </Loader>{" "}
        </Dimmer>{" "}
        <div className="content">
          <h3>
            {" "}
            This is {this.state.userInfo.firstname}{" "}
            home page!{" "}
          </h3>{" "}
          <div className="posts">

            <CreatePost userInfo={this.state.userInfo} type='post' visitor={this.state.userInfo} updatePage={this.updateHomePage}/>

            <div className="oldposts">
              {" "}
              {all_posts}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <FriendList userInfo={this.state.userInfo} />{" "}

        <Button color='red' onClick={this.handleURL}>Test</Button>

      </VisitorContext.Provider>
        <a
          target="_blank"
          href={
            "http://localhost:5000/visualizer/" + this.state.userInfo.userID
          }
        >
          See Friend Visualization
        </a>
        <FriendRecommendation userInfo={this.state.userInfo} />
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
