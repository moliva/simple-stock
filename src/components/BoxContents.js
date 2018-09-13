import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cssModules from 'react-css-modules';
import styles from '../style/counter.scss';
import { connect } from 'react-redux'

@cssModules(styles)
@connect((store) => {
  return {
    boxes: store.boxes.boxes,
    boxesFetching: store.boxes.fetching
  }
})
export default class BoxContents extends Component {
  static propTypes = {
    boxes: PropTypes.array.isRequired,
    styles: PropTypes.object
  };

  render() {
    const { boxes, styles, match } = this.props;

    const boxNumber = match.params.number

    if (boxNumber) {
      const current = boxes.find(box => box.number == boxNumber)
      if (current) {
        return  <div>
                  <h2>Box {current.number}</h2>
                  <ul>
                    {current.items.map(item => 
                      <li key={'item-' + item.name}>{item.name}</li>
                    )}
                  </ul>
                </div>
      } else {
        return <span>Box number {boxNumber} not found! :(</span>
      }
    }
    
    return  <div>
              {boxes.map(box =>
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


    // return (
    //   <div className={styles.boxes}>
    //     <ul>
    //       {boxes.map(box =>
    //         <li><a href={box.number} className={styles.box}>{box.number}</a></li>
    //       )}
    //     </ul>
    //   </div>
    // );
  }
}
