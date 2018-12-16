import React, { Component } from "react";
import {
  Button,
  Image,
  Header,
  Icon,
  Grid,
  Segment,
  Label
} from "semantic-ui-react";
import Post from "../Components/Post";
import profile_default from "../Assets/profile.png";
import Navigationbar from "../Components/Navbar";
import CreatePost from "../Components/CreatePost";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.location.state.userInfo,
      visitor: this.props.location.state.visitor,
      data: {},
      posts: []
      //default photo url:
    };
    this.updateProfilePage = this.updateProfilePage.bind(this);
    this.navigateToUpdateProfile = this.navigateToUpdateProfile.bind(this);
  }

  refreshPage() {
    fetch("/post/getownpost/" + this.state.userInfo.userID, {
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

  componentDidMount() {
    fetch("/user/getprofile/" + this.state.userInfo.userID, {
      method: "GET"
    })
      .then(res => res.json())
      .then(
        result => {
          // check if any field is undefined before display
          this.setState({ data: result.data });
          if (this.state.data.hasOwnProperty("photo")) {
            this.setState({ photo: this.state.data.photo });
          }
        },
        error => {
          alert("Error (loading profile)! Please try again.");
        }
      );

    // get own posts
    fetch("/post/getownpost/" + this.state.userInfo.userID, {
      method: "GET"
    })
      .then(res => res.json())
      .then(
        res => {
          // check if any field is undefined before display
          this.setState({ posts: res.data });
        },
        error => {
          alert("Error (loading posts)! Please try again.");
        }
      );

    this.interval = setInterval(() => this.refreshPage(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handlePhotoUpload = e => {
    e.preventDefault();
    var formdata = new FormData();
    var imagedata = document.querySelector('input[type="file"]').files[0];
    formdata.append("photo", imagedata);
    console.log(imagedata);
    fetch("/user/uploadphoto/" + this.state.userInfo.userID, {
      mode: "no-cors",
      method: "POST",
      body: formdata
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({ photo: result.data.photo });
        },
        error => {
          alert("Error! Please try again.");
        }
      );
  };

  updateProfilePage() {
    fetch("/post/getownpost/" + this.state.userInfo.userID, {
      method: "GET"
    })
      .then(res => res.json())
      .then(
        res => {
          this.setState({ posts: res.data });
        },
        error => {
          console.log(error);
          alert("error (get all post)");
        }
      );
  }

  navigateToUpdateProfile(e) {
    e.preventDefault();
    this.props.history.push({
      pathname: "/updateprofile",
      state: {
        userInfo: this.state.userInfo,
        data: this.state.data
      }
    });
  }

  render() {
    let photo;
    if (this.state.hasOwnProperty("photo")) {
      photo = (
        <Image
          name="users"
          circular
          size="medium"
          centered
          src={this.state.photo}
        />
      );
    } else {
      photo = (
        <Image
          name="users"
          circular
          size="medium"
          centered
          src={profile_default}
        />
      );
    }

    let interests = [];
    if (this.state.data.hasOwnProperty("interests")) {
      interests = this.state.data.interests;
    }

    const list = interests.map(item => (
      <Label as="a" tag>
        {item}
      </Label>
    ));
    let own;
    if(this.state.userInfo.userID === this.state.visitor.userID) {
      own = true;
    } else {
      own = false;
    }

    const my_own_posts = this.state.posts.map(post => (
      <Post
        info={post}
        userInfo={this.state.userInfo}
        visitor={this.state.visitor}
        updateHomePage={this.updateProfilePage}
        own = {own}
      />
    ));
    var gender;
    if (this.state.data.gender)
      gender = this.state.data.gender == "F" ? "Female" : "Male";
    else gender = "Unknown";
    console.log();
    const disableUpload =
      this.state.userInfo.userID !== this.state.visitor.userID;
    return (
      <div>
        <Navigationbar userInfo={this.state.visitor} />
        <Segment>
          <Grid>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
              {photo}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
              <h2>
                {this.state.userInfo.firstname} {this.state.userInfo.lastname}
              </h2>
              <h4>Affiliation: {this.state.data.affiliation}</h4>
              <h4>Birthday: {this.state.data.birthday}</h4>
              <h4>Gender: {gender}</h4>
              <h4>Email: {this.state.data.email}</h4>
              <h4>Interest: {list}</h4>
              <Button primary onClick={this.navigateToUpdateProfile}>
                Add Friend
              </Button>
              {this.state.userInfo.userID === this.state.visitor.userID &&
                <Button onClick={this.navigateToUpdateProfile}>Update Profile</Button>
              }
            </Grid.Column>
            <Grid.Column width={2} />
          </Grid>
        </Segment>

        <div className="posts">
          <CreatePost
            userInfo={this.state.userInfo}
            visitor={this.state.visitor}
            type="message"
            updatePage={this.updateProfilePage}
          />
          {my_own_posts}
        </div>

      </div>

    );
  }
}
export default Profile;
