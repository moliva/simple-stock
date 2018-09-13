import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cssModules from 'react-css-modules'
// import styles from '../style/boxes.scss'

// @cssModules(styles)
export default class Boxes extends Component {
  static propTypes = {
    boxes: PropTypes.array.isRequired,
    styles: PropTypes.object
  };

  render() {
    const { boxes, styles, boxNumber } = this.props;

    const stylesBox = [
      { class: 'btn-warning', style: { backgroundColor: '#ace600'} },
      { class: 'btn-warning', style: { backgroundColor: '#993399' } },
      { class: 'btn-warning', style: { backgroundColor: '#ffffcc' } },
      { class: 'btn-warning', style: { backgroundColor: '#ffcccc' } },
      { class: 'btn-warning', style: {  } },
      { class: 'btn-info', style: { color: '#000000' } },
      { class: 'btn-info progress-bar-striped', style: { color: '#000000' } },
      { class: 'btn-warning progress-bar-striped', style: {  } }
    ]

    return (
      <ul className='nav nav-pills nav-fill'>
        {boxes.map(box =>
          <li className='nav-item' key={'menu-' + box.number}>
            <a href={boxNumber == box.number ? '/' : box.number} className={'nav-link border ' + stylesBox[box.number - 1].class
             + (boxNumber == box.number ? ' active' : '')
            } 
             style={stylesBox[box.number - 1].style}>{box.number}</a>
          </li>
        )}
      </ul>
    )
  }
}
