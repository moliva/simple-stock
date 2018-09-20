const initialState = { boxes: [], fetching: false, fetched: false};

export default (state=initialState, action) => {
  switch (action.type) {
    case 'BOXES_PENDING': {
      return {...state, fetching: true }
    }
    case 'BOXES_FULFILLED': {
      return {...state, fetching: false, fetched: true, boxes: action.payload }
    }
    case 'BOXES_REJECTED': {
      return {...state, fetching: false, fetched: false, error: action.payload }
    }
    case 'ITEM_UPDATE_PENDING': {
      return state
    }
    case 'ITEM_UPDATE_FULFILLED': {
      const newBoxes = [...state.boxes]
      const editingBox = newBoxes[action.payload.box - 1]
      editingBox.items[action.payload.item].name = action.payload.name
      return {...state, boxes: newBoxes }
    }
    case 'ITEM_UPDATE_REJECTED': {
      return state
    }
    case 'ITEM_DELETE_PENDING': {
      return state
    }
    case 'ITEM_DELETE_FULFILLED': {
      const newBoxes = [...state.boxes]
      const editingBox = newBoxes[action.payload.box - 1]
      editingBox.items.splice(action.payload.item, 1)
      return {...state, boxes: newBoxes }
    }
    case 'ITEM_DELETE_REJECTED': {
      return state
    }
    case 'ITEM_CREATE_PENDING': {
      return state
    }
    case 'ITEM_CREATE_FULFILLED': {
      // const newBoxes = [...state.boxes]
      // const newBox = {...newBoxes[action.payload.boxNumber - 1]}
      // const newItems = newBox.items.slice()
      // newItems.push(action.payload.item)
      // newBox.items = newItems
      // newBoxes[action.payload.boxNumber - 1] = newBox
      // console.log(newItems)
      // console.log(state.boxes[action.payload.boxNumber - 1].items)
      // return {...state, boxes: newBoxes }
      return state
    }
    case 'ITEM_CREATE_REJECTED': {
      return state
    }
  }
  return state
}