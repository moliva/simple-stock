import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cssModules from 'react-css-modules';
import styles from '../style/counter.scss';
import { updateItem, removeItem, createItem } from '../actions/boxes'
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

  constructor(props) {
    super(props)
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onNewItem = this.onNewItem.bind(this)
  }

  state = {
    editing: { box: -1, item: -1 },
    boxes: this.props.boxes
  }

  // TODO - should be changed for the below static getDerivedStateFromProps when upgrading react version
  componentWillReceiveProps(nextProps) {
    this.setState({...this.state,
      boxes: nextProps.boxes
    })
  }

  filterContent(boxes, filter) {
    const options = {
      shouldSort: true,
      findAllMatches: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        'name',
        'items.name'
      ]
    }
    const fuse = new Fuse(boxes, options)
    return fuse.search(filter);
  }

  isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }

  handleDoubleClick(boxNumber, item, index) {
    return (event) => {
      this.setState({...this.resetEditing(this.state),
        editing: { box: boxNumber, item: index }
      })
    }
  }

  onSave(event) {
    this.props.dispatch(updateItem(this.state.editing))
  }

  onNewItem(box) {
    return (event) => {
      const newItem = { name: 'Nuevo' }
      const newBoxes = [...this.state.boxes]
      const newItems = newBoxes[box - 1].items.slice()
      newItems.push(newItem)
      // console.log(newBoxes[box - 1].items)
      newBoxes[box - 1].items = newItems
      // console.log(newItems)
      this.setState({...this.resetEditing(this.state),
        editing: { box, item: newBoxes[box - 1].items.length - 1, name: newItem.name },
        boxes: newBoxes
      })
      this.props.dispatch(createItem(box, newItem))
    }
  }

  onCancel(event) {
    this.setState(this.resetEditing(this.state))
  }

  onRemove(editing) {
    return (event) => {
      const newBoxes = [...this.state.boxes]
      newBoxes[editing.box - 1].items.splice(editing.item, 1)
      this.setState({...this.resetEditing(this.state),
        boxes: newBoxes
      })
      this.props.dispatch(removeItem(this.state.editing))
    }
  }

  resetEditing(state) {
    return {...state,
      editing: { box: -1, item: -1, name: null }
    }
  }
  
  onEdit(editing) {
    return (event) => {
      // const boxes = [...this.state.boxes]
      // this.findEditingitem(editing).name = event.target.value
      const newEditing = {...editing,
        name: event.target.value
      }
      this.setState({...this.state, editing: newEditing})
    }
  }

  findEditingitem(editing) {
    return this.state.boxes[editing.box - 1].items[editing.item]
  }

  render() {
    const { styles, match, filter } = this.props;

    const boxNumber = match.params.number

    let boxes_ = this.state.boxes

    if (boxNumber) {
      boxes_ = boxes_.filter(box => box.number == boxNumber)
      if (boxes_.length == 0) {
        return <span>Box number {boxNumber} not found! :(</span>
        }
      }

    let toShow = this.isBlank(filter) ? boxes_ : boxes_.map(box => ({ number: box.number, items: this.filterContent(box.items, filter) }))
    toShow = this.isBlank(filter) ? toShow : this.filterContent(toShow, filter)
    
    const editing = this.state.editing

    return  <div>
              {toShow.map(box =>
                <div key={'box-contents-' + box.number}>
                  <p className="lead">Box {box.number} <a href="#" className="badge badge-success" onClick={this.onNewItem(box.number)}>+</a></p>
                  {/* TODO - implement new item */}
                  {/* <h2>Box {box.number} <a href="#" className="badge badge-success">New item</a></h2> */}
                  <ul>
                    {box.items.map((item, index) => {
                      if (editing.box == box.number && editing.item == index) {
                        return <div key={'item-' + index} className='input-group mb-3'>
                                  <input type="text" className='form-control' value={editing.name ? editing.name : item.name} onChange={this.onEdit(editing)} />
                                  <div className="input-group-append">
                                    <a href="#" className='input-group-text btn btn-primary' onClick={this.onCancel}>~</a>
                                    <a href="#" className='input-group-text btn btn-danger' onClick={this.onRemove(editing)}>X</a>
                                    <a href="#" className='input-group-text btn btn-success' onClick={this.onSave}>V</a>
                                  </div>
                               </div>
                      } else {
                        return <li key={'item-' + index} onDoubleClick={this.handleDoubleClick(box.number, item, index)}>{item.name}</li>
                      }
                    }
                    )} 
                  </ul>
                </div>
              )}
            </div>
  }
}
