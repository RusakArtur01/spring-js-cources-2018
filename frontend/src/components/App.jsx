import React, {Component} from 'react';
import {Header} from './header';
import {Footer} from './footer';
import ToDoList from './list/ToDoList';

export default class App extends Component {


  render() {
    return (
      <div>
        <Header/>
        <section className="main-content blue-background">
          <div className="todo-container wrapper">
            <div className="todo-container-todos">
              <ToDoList/>
            </div>
          </div>
        </section>
        <Footer/>
      </div>
    );
  }
};
