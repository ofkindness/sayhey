import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import {Sayhey} from './app/sayhey';

import './index.scss';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Sayhey}/>
  </Router>,
  document.getElementById('root')
);
