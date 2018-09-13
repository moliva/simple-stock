import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Search extends Component {
  render() {
    return (
        <div className='input-group mb-3'>
          <input type="search" className='form-control' />
          <div className="input-group-append">
            <a href="#" className='input-group-append btn btn-primary input-group-text'>Search</a>
          </div>
        </div>
    );
  }
}
