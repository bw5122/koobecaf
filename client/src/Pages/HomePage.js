import React, {Component} from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import Post from '../Components/Post';
import FriendList from '../Components/FriendList'
import '../Styles/Home.css'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // all fields limit length to 20 characters
      userInfo: this.props.location.state.userInfo,
      posts: [{postBy: 'jack',
              creator: 'jack',
              content: 'test post',
              friendtags: ['berry']}],
      newpost: '',
      friendtags: []

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
    console.log("Home:");
    console.log(this.props.location.state.userInfo);
  }

  navigate() {
    alert("Shit");
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
        postBy: this.state.userID,
        creator: this.state.userID,
        content: this.state.newpost,
        friendtags: this.state.friendtags
      })
    })
    .then(res => res.json())
    .then(
      (data) => {
        this.setState(prevState => ({
          posts: [data, prevState.posts]
        }))
      },
      (error) => {
        alert("error");
      }
    )
  }

  componentDidMount() {
    fetch("/post/getallpost" + this.state.userID, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: this.state.userID,
      })
    })
    .then(res => res.json())
    .then(
      (data) => {
        this.setState({posts: data});
      },
      (error) => {
        alert("error");
      }
    )
  }
//TODO: share button
  render() {
    const username = this.props.location.state.username;

    const all_posts = this.state.posts.map((post) =>
      <Post info={post} userID={this.state.userID}/>
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
            <ul>{all_posts}</ul>
            </div>
          </div>
        </div>
        <FriendList userInfo={this.state.userInfo}/>
      </div>
    )
  }
}
/* not applied to the new strcutre this.props.info
<Post creator="User2" content="Wowwwww!!!" />
<Post creator="User3" content="Happy Thanksgiving!" />
<Post creator="User4" content="Happy Birthday!" />
*/
export default Home;
