import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cssModules from 'react-css-modules';
import styles from '../style/counter.scss';

@cssModules(styles)
export default class Boxes extends Component {
  static propTypes = {
    boxes: PropTypes.array.isRequired,
    styles: PropTypes.object
  };

  render() {
    const { boxes, styles } = this.props;

    return (
      <div className={styles.boxes}>
        <ul>
          {boxes.map(box =>
            <li><a href={box.number} className={styles.box}>{box.number}</a></li>
          )}
        </ul>
      </div>
    );
  }
}
