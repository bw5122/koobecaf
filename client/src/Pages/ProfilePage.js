import React, { Component } from "react";
import Post from "../Components/Post";
import profile_default from '../Assets/profile.png';
import Navigationbar from '../Components/Navbar'

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.location.state.userInfo,
      data: {},
      posts: []
      //default photo url:
    };
    this.updateProfilePage = this.updateProfilePage.bind(this);
  }

  componentDidMount() {
    fetch("/user/getprofile/" + this.state.userInfo.userID, {
      method: "GET",
    })
    .then(res => res.json())
    .then(
      (result) => {
        // check if any field is undefined before display
        this.setState({data: result.data});
        if(this.state.data.hasOwnProperty('photo')) {
          this.setState({photo: this.state.data.photo});
        }
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
    fetch("/user/uploadphoto/" + this.state.userInfo.userID, {
      mode: "no-cors",
      method: "POST",
      body: formdata
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({photo: result.data.photo});
        },
        error => {
          alert("Error! Please try again.");
        }
      );
  };

  updateProfilePage() {
    fetch("/post/getownpost/" + this.state.userInfo.userID, {
      method: "GET",
    })
    .then(res => res.json())
    .then(
      (res) => {
        this.setState({posts: res.data});
      },
      (error) => {
        console.log(error);
        alert("error (get all post)");
      }
    )
  }

  render() {

    let photo;
    if(this.state.hasOwnProperty('photo')) {
      photo = <img src={this.state.photo} className="profile_photo" alt="profile_photo" />
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
      <Post info={post} userInfo={this.state.userInfo} updateHomePage={this.updateProfilePage}/>
    );

    return (
      <div>
      <Navigationbar userInfo={this.state.userInfo} />
        <div className="photo">
          {photo}
        </div>
      <h3 id="name">{this.state.userInfo.firstname} {this.state.userInfo.lastname}</h3>
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
      <div className="posts"><ul>{my_own_posts}</ul></div>
      </div>
    );
  }
}
export default Profile;
