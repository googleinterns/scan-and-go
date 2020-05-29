import React from 'react';
import ReactDOM from 'react-dom';
import StoreUI from './StoreUI';
import * as serviceWorker from './serviceWorker';

alert("yo");

ReactDOM.render(
  <React.StrictMode>
    <StoreUI />
  </React.StrictMode>,
  document.getElementById('UI')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
