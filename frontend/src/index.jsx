import React from 'react';
import ReactDOM from 'react-dom';
import {App} from "./App";

const Web  = () => {
  return(
      <App/>
  );
};

ReactDOM.render( <Web />, document.getElementById('react-root'));