import { handleActions } from 'redux-actions';
// import { boxes_fetch, boxes_fetch_fullfilled } from '../actions/boxes'

const initialState = { boxes: [], fetching: false, fetched: false};

// export default handleActions({
//   [boxes_pending]: state => state,
//   [boxes_fullfilled]: state => state
// }, initialState);

export default (state=initialState, action) => {
  switch (action.type) {
    case 'BOXES_PENDING': {
      return {...state, fetching: true }
    }
    case 'BOXES_FULFILLED': {
      return {...state, fetching: false, fetched: true, boxes: action.payload }
    }
    case 'BOXES_': {
      return {...state, fetching: false, fetched: false, error: action.payload }
    }
  }
  return state
}