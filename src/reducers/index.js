import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import boxes from './boxes';
import filter from './filter';

const rootReducer = combineReducers({
  boxes,
  filter,
  routing
});

export default rootReducer;
