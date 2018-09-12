import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Search extends Component {
  render() {
    return (
      <div>
        <input type="search" />
        <a href="#">Search</a>
      </div>
    );
  }
}
