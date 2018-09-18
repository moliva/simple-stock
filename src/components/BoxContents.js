import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cssModules from 'react-css-modules';
import styles from '../style/counter.scss';
import { connect } from 'react-redux'
import Fuse from 'fuse-js-latest'

@cssModules(styles)
@connect((store) => {
  return {
    boxes: store.boxes.boxes,
    boxesFetching: store.boxes.fetching,
    filter: store.filter
  }
})
export default class BoxContents extends Component {
  static propTypes = {
    boxes: PropTypes.array.isRequired,
    styles: PropTypes.object
  }

  filterContent(boxes, filter) {
    const options = {
      shouldSort: true,
      findAllMatches: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        'name'
      ]
    }
    const fuse = new Fuse(boxes, options)
    return fuse.search(filter);
  }

  isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }

  render() {
    const { boxes, styles, match, filter } = this.props;

    const boxNumber = match.params.number

    let boxes_ = boxes
    if (boxNumber) {
      boxes_ = boxes.filter(box => box.number == boxNumber)
      if (boxes_.length == 0) {
        return <span>Box number {boxNumber} not found! :(</span>
        }
      }
    
    const toShow = this.isBlank(filter) ? boxes_ : boxes_.map(box => ({ number: box.number, items: this.filterContent(box.items, filter) }))
      
    return  <div>
              {toShow.map(box =>
                <div key={'box-contents-' + box.number}>
                  <h2>Box {box.number}</h2>
                  <ul>
                    {box.items.map(item => 
                      <li key={'item-' + item.name}>{item.name}</li>
                    )} 
                  </ul>
                </div>
              )}
            </div>
  }
}
