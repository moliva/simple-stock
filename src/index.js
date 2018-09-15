import React from 'react';
import { render } from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import configureStore from './store/configureStore';
import Root from './containers/Root';

import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js'

const store = configureStore();
const history = createHistory({
  basename: process.env.PUBLIC_URL,
});

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
