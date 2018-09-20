import React, { Component } from 'react'
import { updateFilter } from '../actions/filter'
import { connect } from 'react-redux'

@connect((store) => {
  return {
    filter: store.filter,
  }
})
export default class Search extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  componentWillMount() {
    const { filter }  = this.props
    this.state = { value: filter }
  }

  handleChange(event) {
    const newValue = event.target.value
    const newState = { value: newValue }

    this.setState(newState)
    this.props.dispatch(updateFilter(newValue))
  }

  onClear(event) {
    const newValue = ''
    const newState = { value: newValue }

    this.setState(newState)
    this.props.dispatch(updateFilter(newValue))
  }

  render() {
    // const { filter } = this.props

    return (
        <div className='input-group mb-3'>
          <input type="search" className='form-control' value={this.state.value} onChange={this.handleChange} />
          <div className="input-group-append">
            <a href="#" className='input-group-text btn btn-secondary' onClick={this.onClear}>X</a>
          </div>
        </div>
    )
  }
}
