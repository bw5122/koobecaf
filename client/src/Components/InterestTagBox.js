import React, { Component } from "react";
import { Input, Button, Label, Icon } from 'semantic-ui-react';

class InterestTagBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.interests,
      text: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.addInterest = this.addInterest.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({
      text: value
    })
  }

  addInterest() {
    this.setState({
      tags: [...this.state.tags, this.state.text]
    });
    this.props.updateInterests(this.state.tags);
  }

  render() {
    const tags = this.state.tags.map((tag) =>
      <Label>{tag}<Icon name='delete' /></Label>
    )
    return (
      <div>
      <div>{tags}</div><br/>
      <Input type='text' onChange={this.handleChange} placeholder='What are you interested in?' action>
        <input />
        <Button onClick={this.addInterest}>Add</Button>
      </Input>
      </div>
    )
  }
}

export default InterestTagBox;
