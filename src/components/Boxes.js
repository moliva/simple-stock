import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cssModules from 'react-css-modules'
import styles from '../style/boxes.scss'

@cssModules(styles)
export default class Boxes extends Component {
  static propTypes = {
    boxes: PropTypes.array.isRequired,
    styles: PropTypes.object
  };

  render() {
    const { boxes, styles, boxNumber } = this.props;

    const stylesBox = [
      { class: styles.btnBox1, style: { } },
      { class: styles.btnBox2, style: { } },
      { class: styles.btnBox3, style: { } },
      { class: styles.btnBox4, style: { } },
      { class: 'btn-warning', style: { } },
      { class: 'btn-info', style: { color: '#000000' } },
      { class: 'btn-info progress-bar-striped', style: { color: '#000000' } },
      { class: 'btn-warning progress-bar-striped', style: { } }
    ]

    console.log(styles)

    return (
      <ul className='nav nav-pills nav-fill'>
        {boxes.map(box =>
          <li className='nav-item' key={'menu-' + box.number}>
            <a id='btnBox1' href={boxNumber == box.number ? process.env.PUBLIC_URL + '/' : box.number} className={
              stylesBox[box.number - 1].class + (boxNumber == box.number ? ' ' + styles.active : '') + ' nav-link border'
            } 
             style={stylesBox[box.number - 1].style}>{box.number}</a>
          </li>
        )}
      </ul>
    )
  }
}
