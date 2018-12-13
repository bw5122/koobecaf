import _ from 'lodash'
//import faker from 'faker'
import React, { Component } from 'react'
import { Search, Grid, Header, Segment, Label} from 'semantic-ui-react'
import FriendCard from '../Components/FriendCard';

export default class FriendSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      ids: []
    }
  }
  componentWillMount() {
    this.resetComponent()
  }
  componentDidMount() {
    this.loadFriendList()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  loadFriendList(){
    console.log("loadFriendList");
    fetch("/friend/getfriend/" + this.props.userInfo.userID, {
      method: "GET",
    })
    .then(res => res.json())
    .then( res => {
      if(res.err)
        alert("error: load friend list")
      else {
        var res_ids = res.data.map((friend) =>
          friend.userID
        );
        res_ids = [...res_ids, this.props.userInfo.userID]
        this.setState({
          friends: res.data,
          ids: res_ids,
        })
      }
    })
  }

  handleSearchChange = (e, { value }) => {
    if(value.length < 1) {
      this.resetComponent();
      return;
    }
    this.setState({ isLoading: true, value })
    fetch('/search/searchuser/' + value, {
      method: "GET"
    })
    .then(res => res.json())
    .then(
      (res) => {
        //const filtered = res.data.filter(friend => this.state.ids.indexOf(friend.userID) === -1);
        this.setState({
          isLoading: false,
          results: res.data
        })
      },
      (error) => {
        console.log(error);
        alert("error (search friend)");
      }
    )

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()
    }, 300)
  }

  showFriendCards = (result) => {
    return(
      <FriendCard info={result} userInfo={this.props.userInfo} />
    )
  }

  resultRenderer = (item) => {
    if(this.state.ids.indexOf(item.userID) === -1) {
      return (
        <FriendCard info={item} userInfo={this.props.userInfo} add={true} />
      )
    } else {
      return (
        <FriendCard info={item} userInfo={this.props.userInfo} add={false} />
      )
    }
  }

  /*
  resultRenderer(item) {
    if(this.state.ids.indexOf(item.userID) === -1) {
      return (<FriendCard info={item} />);
    }
  }
  */

  render() {
    const { isLoading, value, results } = this.state

    return (
      <Grid>
        <Grid.Column width={6}>
          <Search
            loading={isLoading}
            placeholder='Search...'
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
            results={results}
            value={value}
            resultRenderer={this.resultRenderer.bind(this)}
            {...this.props}
          />
        </Grid.Column>
      </Grid>
    )
  }
}
