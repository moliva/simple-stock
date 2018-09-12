import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import boxes from './boxes';

const rootReducer = combineReducers({
  boxes,
  routing
});

export default rootReducer;
