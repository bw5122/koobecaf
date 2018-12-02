import React, { Component } from "react";
import Post from "./Post";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: {},
      userID: "2f303ea4-93f6-4a87-a06e-613c9fc0917d"
    };
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
    return (
      <div>
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
      </div>
    );
  }
}
export default Profile;
