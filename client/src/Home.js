import React, {Component} from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import Post from './Post';
import './Home.css'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // all fields limit length to 20 characters
      username: this.props.location.state.username,
      posts: {},
      newpost: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
  }

  navigate() {
    alert("Navigation");
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
    fetch("/createpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        //TODO:
        postBy:
        creator:
        content:
        friendtags:[]
        image:
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

  componentDidMount() {
    fetch("/getpost", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
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

  render() {
    const username = this.props.location.state.username;
    return(
      <div className="homepage">
        <div className="nav">
          <button id="nav_button" onClick="navigate()">Nav</button>
          <ButtonGroup>
            <Button>1</Button>
            <Button>2</Button>
            <Button>3</Button>
            <Button>4</Button>
          </ButtonGroup>
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
            <Post creator="User2" content="Wowwwww!!!" />
            <Post creator="User3" content="Happy Thanksgiving!" />
            <Post creator="User4" content="Happy Birthday!" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;
