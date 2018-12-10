import React, { Component } from "react";
import Post from "../Components/Post";
import profile_default from '../Assets/profile.png';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.location.state.userInfo,
      data: {},
      posts: []
      //default photo url:
    };
  }

  componentDidMount() {
    fetch("/user/getprofile/" + this.state.userInfo.userID, {
      method: "GET",
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
    fetch("/post/getownpost/" + this.state.userInfo.userID, {
      method: "GET",
    })
    .then(res => res.json())
    .then(
      (res) => {
        // check if any field is undefined before display
        this.setState({posts: res.data});
      },
      (error) => {
        alert("Error (loading posts)! Please try again.");
      }
    )

  }

  handlePhotoUpload = e => {
    e.preventDefault();
    var formdata = new FormData();
    var imagedata = document.querySelector('input[type="file"]').files[0];
    formdata.append("photo", imagedata);
    console.log(imagedata);
    fetch("/user/uploadphoto/" + this.state.userID, {
      mode: "no-cors",
      method: "POST",
      body: formdata
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
      <Post info={post} userInfo={this.state.userInfo} />
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
