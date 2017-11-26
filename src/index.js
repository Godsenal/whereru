import React from 'react';
import ReactDOM from 'react-dom';

import 'babel-polyfill';

import { Provider } from 'react-redux';

import { App } from './container';
//import configureStore from './store';

//<Provider store={configureStore()}>
ReactDOM.render(
  <App />,
  document.getElementById('root')
);