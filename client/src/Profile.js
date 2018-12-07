import React, { Component } from "react";
import Post from "./Post";
import profile_default from './profile.png';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: this.props.location.state.firstname,
      lastname: this.props.location.state.lastname,
      userID: this.props.location.state.userID,
      data: {},
      posts: []
      //default photo url:
    };
  }

  componentDidMount() {
    fetch("/user/getprofile/" + this.state.userID, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: this.state.userID
      })
    })
    .then(res => res.json())
    .then(
      (result) => {
        // check if any field is undefined before display
        this.setState({data: result});
      },
      (error) => {
        alert("Error (loading profile)! Please try again.");
      }
    )
    // get own posts
    fetch("/post/getownpost" + this.state.userID, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: this.state.userID
      })
    })
    .then(res => res.json())
    .then(
      (result) => {
        // check if any field is undefined before display
        this.setState({posts: result});
      },
      (error) => {
        alert("Error (loading posts)! Please try again.");
      }
    )

  }

  handlePhotoUpload = e => {
    e.preventDefault();
    var data = new FormData();
    var imagedata = document.querySelector('input[type="file"]').files[0];
    data.append("photo", imagedata);
    console.log(imagedata);
    fetch("/user/uploadphoto/" + this.state.userID, {
      mode: "no-cors",
      method: "POST",
      body: data
    })
      .then(res => res.json())
      .then(
        result => {
          alert("Upload success");
        },
        error => {
          alert("Error! Please try again.");
        }
      );
  };

  render() {

    let photo;
    if(this.state.data.hasOwnProperty('photo')) {
      photo = <img src={require(this.state.data['photo'])} className="profile_photo" alt="profile_photo" />
    } else {
      photo = <img src={profile_default} className="profile_photo" alt="profile_photo" />
    }

    let interests = [];
    if(this.state.data.hasOwnProperty('interests')) {
      interests = this.state.data.interests;
    }

    const list = interests.map((item) =>
      <li>{item}</li>
    );

    const my_own_posts = this.state.posts.map((post) =>
      <Post info={post} />
    );

    return (
      <div>
      /* --- Profile Photo --- */
        <div className="photo">
          {photo}
        </div>
      /* --- Display name --- */
      <h3 id="name">{this.state.firstname} {this.state.lastname}</h3>
      /* --- Personal Info --- */
      <div className="info">
        {this.state.data.hasOwnProperty('affiliation') &&
          <h4>Affiliation: {this.state.data.affiliation}</h4>
        }
        {this.state.data.hasOwnProperty('status') &&
          <h4>Status: {this.state.data.status}</h4>
        }
        {this.state.data.hasOwnProperty('birthday') &&
          <h4>Birthday: {this.state.data.birthday}</h4>
        }
        <ul>{list}</ul>
      </div>
      /* --- Upload photo form --- */
        <h2> Upload Photo </h2>
        <form
          className="photo_form"
          onSubmit={this.handlePhotoUpload.bind(this)}
        >
          <label className="file_upload">
            Choose from file:
            <input type="file" name="photo" />
          </label>{" "}
          <input type="submit" className="upload_button" value="Upload" />
        </form>{" "}
      /* --- Posts --- */
      <div className="posts"><ul>{my_own_posts}</ul></div>
      </div>
    );
  }
}
export default Profile;
