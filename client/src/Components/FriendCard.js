import React, {Component} from 'react'
import { Button, Card, Image, Header, Description} from 'semantic-ui-react'
import profile_default from '../Assets/profile.png';

class FriendCard extends Component {
  constructor(props) {
    super(props);
    this.state ={
      info: this.props.info,
      userInfo: this.props.userInfo
    }
    this.handleAddFriend = this.handleAddFriend.bind(this);
  }

  handleAddFriend() {

  }

  render() {
    const interests = (this.props.info.interests) ? this.props.info.interests.map((ele) =>
      <p>{ele}</p>
    ) : [];
    /*
    {this.props.info.hasOwnProperty('photo') ? (
      <Image floated='right' size='mini' src={this.props.info.photo} />
    ) : (
      <Image floated='right' size='mini' src={profile_default} />
    )}
    */
    return(
      <div>
        {this.props.info.hasOwnProperty('photo') ? (
          <Image floated='right' size='mini' src={this.props.info.photo} />
        ) : (
          <Image floated='right' size='mini' src={profile_default} />
        )}
        <h4>{this.props.info.firstname} {this.props.info.lastname}</h4>
        {this.props.info.hasOwnProperty('affiliation') && (
          <p>Affiliation: {this.props.info.affiliation}</p>
        )}
        <Button primary onClick={this.handleAddFriend}>Add Friend</Button>
      </div>
    )
  }
}

export default FriendCard;
