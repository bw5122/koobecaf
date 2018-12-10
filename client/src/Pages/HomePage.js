import React, {Component} from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import Post from '../Components/Post';
import FriendList from '../Components/FriendList'
import '../Styles/Home.css'
import PinnedSubheaderList from '../Components/ScrollList'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // all fields limit length to 20 characters
      userInfo: this.props.location.state.userInfo,
      posts: [],
      newpost: '',
      friendtags: []

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
    console.log("Home:");
    console.log(this.props.location.state.userInfo);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleCreatePost = e => {
    e.preventDefault();
    const new_post = this.state.newpost;
    if(new_post.length === 0) {
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
      (res) => {
        this.setState({
          posts: [res.data, ...this.state.posts]
        });
        //console.log(this.state.post.size);
      },
      (error) => {
        alert("error (create posts)");
      }
    )
  }

  componentDidMount() {
    fetch("/post/getallpost/" + this.state.userInfo.userID, {
      method: "GET",
    })
    .then(res => res.json())
    .then(
      (res) => {
        this.setState({posts: res.data});
        console.log(this.state.posts);
      },
      (error) => {
        console.log(error);
        alert("error (get all post)");
      }
    )
  }
//TODO: share button
  render() {
    const username = this.props.location.state.username;
    const posts = this.state.posts;
    const all_posts = posts.map((post) =>
      <Post info={post} userInfo={this.state.userInfo} />
    );

    return(
      <div className="homepage">
        <div className="nav">
          <button id="nav_button" onClick={this.navigate}>Nav</button>
          <button id="profile_button" onClick="">{username}</button>
          <button id="home_button" onClick="">Home</button>
        </div>

        <div className="content">
          <h3>This is {username} home page! </h3>
          <div className="posts">
            <form className="createpost" onSubmit={this.handleCreatePost}>
              <input type="text" name="newpost" placeholder="What's on your mind?" id="newpost" value={this.state.newpost.value}  onChange={this.handleChange} maxLength="200" />
              <br/>
              <input type="submit" id="create_button" value="Share" />
            </form>
            <div className="oldposts">
            <div>{all_posts}</div>
            </div>
          </div>
        </div>
        <FriendList userInfo={this.state.userInfo}/>
      </div>
    )
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
