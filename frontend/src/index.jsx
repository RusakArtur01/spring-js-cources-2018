import React from 'react';
import ReactDOM from 'react-dom';
import {Header} from './header'
import {Body} from "./body";
import {Footer} from './footer'

const App = () => {
  return(
    <div>
      <Header/>
      <Body/>
      <Footer/>
    </div>
  );
};


ReactDOM.render( <App />, document.getElementById('react-root'));