import _ from 'lodash'
import React, { Component } from 'react'
import { Search, Grid, Header, Segment, Label} from 'semantic-ui-react'
import FriendCard from '../Components/FriendCard';

export default class EventSearchBar extends Component {
  constructor(props) {
    super(props);

  }

  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  handleSearchChange = (e, { value }) => {
    if(value.length < 1) {
      this.resetComponent();
      return;
    }
    this.setState({ isLoading: true, value })
    fetch('/search/searchevent/' + value, {
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
        alert("error (search event)");
      }
    )

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()
    }, 300)
  }

  resultRenderer = (item) => {
    return (
      <p>This is an event</p>
    )

  }

  render() {
    const { isLoading, value, results } = this.state

    return (
      <Grid>
        <Grid.Column width={4}>
          <Search
            loading={isLoading}
            placeholder='Search events...'
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
