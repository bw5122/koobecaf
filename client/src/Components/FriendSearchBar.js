import _ from 'lodash'
//import faker from 'faker'
import React, { Component } from 'react'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'

const source = _.times(5, () => ({
  title: "Reilly and Sons",
  description: "Function-based intangible pricing structure",
  image: "https://s3.amazonaws.com/uifaces/faces/twitter/nyancecom/128.jpg",
  price: "$96.99"
}))

export default class SearchExampleStandard extends Component {
  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  handleSearchChange = (e, { value }) => {
    if(value.length < 1) {
      return;
    }
    this.setState({ isLoading: true, value })
    fetch('/search/searchuser/' + value, {
      method: "GET"
    })
    .then(res => res.json())
    .then(
      (res) => {
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

  showFriendCards = (results) => {
    const cards = results.map((item) =>
      <p>Hey</p>
    );
    return(
      {cards}
    )
  }

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
            resultRenderer={this.showFriendCards.bind(this)}
            {...this.props}
          />
        </Grid.Column>
      </Grid>
    )
  }
}
