import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cssModules from 'react-css-modules';
import Search from '../components/Search';
import Boxes from '../components/Boxes';
// import styles from '../style/index.scss';
import { connect } from 'react-redux'
import { loadBoxes } from '../actions/boxes'

@connect((store) => {
  return {
    boxes: store.boxes.boxes,
    boxesFetching: store.boxes.fetching,
    filter: store.filter,
    currentBox: store.routing.location.pathname.slice(1)
  }
})
// @cssModules(styles)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    boxes: PropTypes.array.isRequired,
    boxesFetching: PropTypes.bool.isRequired,
    styles: PropTypes.object,
  }

  componentWillMount() {
    this.props.dispatch(loadBoxes())
  }

  render() {
    const { children, styles, boxes, boxesFetching, currentBox, filter } = this.props;

    return (
      <div className='container' style={{ paddingTop: 10 }}>
        <Search filter={filter} />
        <Boxes boxes={boxes} boxNumber={currentBox} />
        {children}
      </div>
    )
  }
}
