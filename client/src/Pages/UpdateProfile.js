import React, { Component } from "react";
import { Button, Image, Form, Grid, Label, Input, Icon} from 'semantic-ui-react';
import Navigationbar from '../Components/Navbar'

const options = [
  { key: 'm', text: 'Male', value: 'M' },
  { key: 'f', text: 'Female', value: 'F' },
  { key: 'o', text: 'Other', value: 'O' }
]

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.location.state.userInfo,
      data: this.props.location.state.data,
      affiliation: this.props.location.state.data.affiliation,
      birthday: this.props.location.state.data.birthday,
      firstname: this.props.location.state.data.firstname,
      lastname: this.props.location.state.data.lastname,
      email: this.props.location.state.data.email,
      interests: this.props.location.state.data.interests,
      gender: this.props.location.state.data.gender,
      text: '',
      oldpassword: '',
      newpassword: '',
      username: '',
    }
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.updateInterests = this.updateInterests.bind(this, this.state.interests);
    this.handleChange = this.handleChange.bind(this);
    this.addInterest = this.addInterest.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount() {
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleSelect(event) {
    const value = event.target.value;
    alert(value);
    this.setState({
      gender: value
    })
  }

  handleUpdate = e => {
    e.preventDefault();
    fetch("/user/updateprofile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: this.state.userInfo.userID,
        affiliation: this.state.affiliation,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        birthday: this.state.birthday,
        email: this.state.email,
        interests: this.state.interests,
        gender: this.state.gender
      })
    })
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({data: result.data});
        if(this.state.data.hasOwnProperty('photo')) {
          this.setState({preview: this.state.data.photo});
        }
      },
      (error) => {
        console.log(error);
        alert("error (update profile)");
      }
    )
  }

  handlePreview(event) {
    this.setState({
      preview: URL.createObjectURL(event.target.files[0])
    })
  }

  handleUpload(e) {
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
  }

  updateInterests(list) {
    this.setState({
      interests: list
    })
  }

  addInterest() {
    this.setState({
      interests: [...this.state.interests, this.state.text]
    });
  }

  handleDelete(e, data) {
    var array = [...this.state.interests];
    var index = array.indexOf(data.value);
    if(index !== -1) {
      array.splice(index, 1);
      this.setState({
        interests: array
      })
    }
  }

  changePassword(e) {
    e.preventDefault();
    fetch("/user/changepassword/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: this.state.userInfo.userID,
        username: this.state.username,
        oldpassword: this.state.oldpassword,
        newpassword: this.state.newpassword
      })
    })
      .then(res => res.json())
      .then(
        result => {
          alert("Password changed.")
        },
        error => {
          alert("Error! Please try again.");
        }
      );
  }

  render() {
    //const { value } = this.state;
    const tags = (this.state.interests !== undefined) ? (this.state.interests.map((tag) =>
      <Label onClick={this.handleDelete} value={tag}>{tag}<Icon name='delete' /></Label>
    )) : []
    return (
      <Grid>
      <Grid.Row columns={1}>
        <Navigationbar width={"100%"} userInfo={this.state.userInfo} />
      </Grid.Row>
      <Grid.Row>
        <Grid.Column floated='left' width={8}>
          <Form>
            <Form.Group widths='equal'>
              <Form.Input fluid name='firstname' label='First name' placeholder='First name' onChange={this.handleChange} />
              <Form.Input fluid name='lastname' label='Last name' placeholder='Last name' onChange={this.handleChange} />
              <Label>
                Gender:
                <select class='semantic ui' value={this.state.gender} name='gender' onChange={this.handleChange} >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </Label>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Input fluid name='email' label='Email' placeholder='example@gmail.com' onChange={this.handleChange} />
              <Form.Input fluid name='affiliation' label='Affiliation' placeholder='Affiliation' onChange={this.handleChange} />
            </Form.Group>
            <div>{tags}</div><br/>
            <Input type='text' name='text' onChange={this.handleChange} placeholder='What are you interested in?' action>
              <input />
              <Button onClick={this.addInterest}>Add</Button>
            </Input>
            <Form.Button primary onClick={this.handleUpdate}>Update</Form.Button>
          </Form>
        </Grid.Column>
        <Grid.Column  width={6}>
          <Form>
            <Image src={this.state.preview} size='medium' fluid/>
            <Form.Group>
              <Form.Input type='file' onChange={this.handlePreview} />
              <Form.Button onClick={this.handleUpload}>Upload</Form.Button>
            </Form.Group>
          </Form>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
      <Grid.Column>
        <Form>
        <Form.Group widths='equal'>
          <Form.Input fluid name='oldpassword' label='Old password' placeholder='Enter your old password' onChange={this.handleChange} />
          <Form.Input fluid name='newpassword' label='New password' placeholder='Enter your new password' onChange={this.handleChange} />
          <Form.Input fluid name='username' label='Username' placeholder='Enter username' onChange={this.handleChange} />
        </Form.Group>
        <Form.Button primary onClick={this.changePassword}>Change Password</Form.Button>
        </Form>
      </Grid.Column>
      </Grid.Row>
      </Grid>
    )
  }
}

export default UpdateProfile;
