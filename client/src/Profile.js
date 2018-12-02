import React, {Component} from 'react';
import Post from './Post';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: {},
      userID: 1
    }
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
        alert("get profile success");
      },
      (error) => {
        alert("Error! Please try again.");
      }
    )
  }

  handlePhotoUpload = e => {
    e.preventDefault();
    fetch("/user/uploadphoto/" + this.state.userID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({

      })
    })
    .then(res => res.json())
    .then(
      (result) => {
        alert("Upload success");
      },
      (error) => {
        alert("Error! Please try again.");
      }
    )
  }

  render() {
    return (
      <div>
      <h2>Upload Photo</h2>

      <form className="photo_form" onSubmit={this.handlePhotoUpload.bind(this)}>
        <label className="file_upload">
          Choose from file:
          <input type="file"/>
        </label>
        <input type="submit" className="upload_button" value="Upload" />
      </form>
      </div>
    )
  }

}
export default Profile;
