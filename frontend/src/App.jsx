import React, {Component} from 'react';
import {ToDoList} from './ToDoList';
import {Header} from './header'
import {Footer} from './footer'
import ToDoForm from './ToDoForm';
import {data} from './storage';

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {todos: data};
    console.log(this.state);
    this.handleShowComment = this.handleShowComment.bind(this);
    this.handleDone = this.handleDone.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleLikeItem = this.handleLikeItem.bind(this);
    this.handleRemovingItem = this.handleRemovingItem.bind(this);
  }

  componentDidUpdate() {
    const updatedData = JSON.stringify(this.state.todos);
    localStorage.setItem('todos', updatedData);
  }

  handleAddItem({title, description}) {

    const {todos} = this.state;

    const newItem = {
      id: new Date(),
      title,
      description,
      completed: false,
      createdDate: new Date(),
      lastUpdatedDate: new Date(),
      comments: [],
      createdByUserId: 1,
      isLiked: false,
      lastUpdatedByUserId: 1
    };

    this.setState(() => ({list: [...todos, newItem]}));

  };

  handleRemovingItem(id) {

    const {todos} = this.state;
    const index = todos.findIndex((item) => {
      return item.id === id;
    });

    if (index >= 0) {
      console.log(id);
      todos.splice(index, 1);
      this.setState(() => ({list: todos}));
    }
  }

  handleDone(id) {

    const {todos} = this.state;

    todos.map((item) => {
      if (item.id === id) {
        item.completed = !item.completed;
      }
      return item;
    });

    this.setState(() => ({todos: todos}));
  }

  handleLikeItem(id) {

    const {todos} = this.state;

    todos.map((item) => {
      if (item.id === id) {
        item.isLiked = !item.isLiked;
      }
      return item;
    });

    this.setState(() => ({todos: todos}));
  }

  handleShowComment(id, comment) {

    const {todos} = this.state;

    todos.map((item) => {
      if (item.id === id)
        item.comments.push(comment);
      return item;
    });

    this.setState(() => ({todos: todos}));
  }

  render() {
    const {todos} = this.state;
    return (
      <div>
        <Header/>
        <section className="main-content blue-background">
          <div className="todo-container wrapper">
            <div className="todo-container-todos">
              <ToDoForm
                onTodoSubmit={this.handleAddItem}
              />
              <ToDoList
                todos={todos}
                onAddComment={this.handleShowComment}
                onLikeToDo={this.handleLikeItem}
                onRemoveToDo={this.handleRemovingItem}
                onSetReady={this.handleDone}
              />
            </div>
          </div>
        </section>
        <Footer/>
      </div>
    );
  }
}