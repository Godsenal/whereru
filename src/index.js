import React from 'react';
import ReactDOM from 'react-dom';

import 'babel-polyfill';

import { Provider } from 'react-redux';

import { LocaleProvider } from 'antd';
import koKR from 'antd/lib/locale-provider/ko_KR';

import { App } from './container';
import { store } from './store';


ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={koKR}>
      <App />
    </LocaleProvider>
  </Provider>,
  document.getElementById('root')
);