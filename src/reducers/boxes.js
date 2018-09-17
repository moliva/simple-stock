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
  }
  return state
}