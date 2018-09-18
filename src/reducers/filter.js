const initialState = '';

export default (state=initialState, action) => {
  switch (action.type) {
    case 'FILTER_UPDATED': {
      return action.payload
    }
  }
  return state
}