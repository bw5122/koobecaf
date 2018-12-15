import React, { Component } from "react";
import { Button, Form, Input, Label, Icon, TextArea, Segment, Image} from "semantic-ui-react";

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.userInfo,
      visitor: this.props.visitor,
      post:'',
      events: [],
      text: '',
      hasImage: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  addEvent() {
    this.setState({
      events: [...this.state.events, this.state.text]
    });
  }

  handleDelete(e, data) {
    var array = [...this.state.events];
    var index = array.indexOf(data.value);
    if(index !== -1) {
      array.splice(index, 1);
      this.setState({
        events: array
      })
    }
  }

  handleCreatePost = e => {
    e.preventDefault();
    const new_post = this.state.post;
    if (new_post.length === 0) {
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
        type: this.props.type,
        postBy: this.state.userInfo.userID,
        creator: this.state.visitor.userID,
        content: this.state.post,
        hashtags: this.state.events,
      })
    })
    .then(res => res.json())
    .then(
    (result) => {
      if(!this.state.hasImage) {
        this.props.updatePage();
        return;
      }
      this.setState({
        hasImage: false
      })
      var formdata = new FormData();
      var imagedata = document.querySelector('input[type="file"]').files[0];
      formdata.append("image", imagedata);
      fetch("/post/uploadimage/" + result.data.postID, {
        mode: "no-cors",
        method: "POST",
        body: formdata
      })
      .then(res => res.json())
      .then(
        result => {
          this.props.updatePage(e);
        },
        error => {
          alert("Error! Please try again.");
        }
      );

    },
    (error) => {
        alert("error (create posts)");
      }
    );
  }

  handlePreview(event) {
    this.setState({
      preview: URL.createObjectURL(event.target.files[0]),
      hasImage: true
    })
  }

  render() {
    const tags = this.state.events.map((tag) =>
      <Label onClick={this.handleDelete} value={tag}>#{tag}<Icon name='delete' /></Label>
    )
    var placeholder;
    switch(this.props.type) {
      case 'post':
        placeholder = "What's on your mind?"
        break;

      case 'message':
        placeholder = "Say something to your friend."
        break;

    }
    const seg_style = {
      width: '60%',
      height: 'inherit'
    };

    return(
      <Segment style={seg_style}>
      <Form>
      {tags}
      <Form.Group widths='equal'>
        <Form.Field required>
          <TextArea
            type="text"
            name="post"
            placeholder="Write a comment..."
            id="newpost"
            value={this.state.post.value}
            onChange={this.handleChange}
            maxLength="100"
            placeholder={placeholder}
            style={{ minHeight: 80, width: "50%", marginTop: "10px" }}
          />
        </Form.Field>
      </Form.Group>
        <Image src={this.state.preview} size='medium' fluid/>
        <Form.Group>
          <Form.Input type='file' onChange={this.handlePreview} />
        </Form.Group>

      {this.props.type==='post' &&
        <Form.Group>
          <Input type='text' name='text' onChange={this.handleChange} placeholder='Add tags to your post!' action>
            <input />
            <Button onClick={this.addEvent}>Add Event</Button>
          </Input>

        </Form.Group>
      }

      <Button color='brown' onClick={this.handleCreatePost} >Post</Button>
      </Form>
      </Segment>
    )


  }
}

export default CreatePost;
