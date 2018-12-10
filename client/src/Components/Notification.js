import React, {Component} from 'react';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.userInfo,
      info: this.props.info
    }
  }

  render() {
    if(this.props.info.type === 'public_new_profile') {
      return(
        <p>xxx updated his/her profile</p>
      )
    } else if(this.props.info.type === 'public_new_status') {
      return(
        <p>xxx posted an update</p>
      )
    } else if(this.props.info.type === 'public_new_photo') {
      return(
        <p>xxx updated his/her profile photo</p>
      )
    } else if(this.props.info.type === 'public_new_share') {
      return(
        <p>xxx shared a post</p>
      )
    } else if(this.props.info.type === 'private_new_message') {

    } else if(this.props.info.type === 'private_new_friend') {

    } else if(this.props.info.type === 'private_deny_friend') {

    } else if(this.props.info.type === 'private_new_like') {
      return(
        <p>xxx liked your post</p>
      )
    } else if(this.props.info.type === 'private_new_comment') {
      return(
        <p>xxx commented on your posts</p>
      )
    }
  }
}

export default Notification;
