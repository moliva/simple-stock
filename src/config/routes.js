import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFoundPage from '../containers/NotFoundPage';
import BoxContents from '../components/BoxContents'

export default (
  <Switch>
    <Route exact path="/:number?" component={BoxContents} />
    <Route component={NotFoundPage} />
  </Switch>
);
