import React, { Component } from 'react';
import { ToDoList } from './components/ToDoList';
import { Header } from './components/header';
import { Footer } from './components/footer';
import ToDoForm from './components/ToDoForm';
import ToDoService from './services/ToDoService';
import ToDoListService from './services/ToDoListService';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { todos: [] };

    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleDone = this.handleDone.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleLikeItem = this.handleLikeItem.bind(this);
    this.handleRemovingItem = this.handleRemovingItem.bind(this);
  }

  componentWillMount() {
    this.toDoOperations = new ToDoService();
    this.toDoListOpreations = new ToDoListService();

    this.toDoListOpreations.getAllToDos()
      .then((todos) => {
        this.setState({
          todos,
        });
      });
  }

  componentDidUpdate() {
    this.toDoListOpreations.saveTodoList(this.state.todos);
  }

  handleAddItem({ title, description }) {
    const { todos } = this.state;
    const newItem = this.toDoOperations.createToDo(title, description);
    this.setState(() => ({ todos: [...todos, newItem] }));
  }

  handleRemovingItem(id) {
    const { todos } = this.state;
    const index = this.toDoListOpreations.findToDoIndex(todos, id);
    const newToDo = this.toDoListOpreations.removeToDoItem(todos, index);

    this.setState(() => ({ todos: newToDo }));
  }

  handleDone(id) {
    const { todos } = this.state;

    const index = this.toDoListOpreations.findToDoIndex(todos, id);
    todos[index].completed = !todos[index].completed;
    this.toDoListOpreations.commonUpdatingItem(todos, index, todos[index].completed);


    this.setState(() => ({ todos }));
  }

  handleLikeItem(id) {
    const { todos } = this.state;

    const index = this.toDoListOpreations.findToDoIndex(todos, id);
    todos[index].isLiked = !todos[index].isLiked;
    this.toDoListOpreations.commonUpdatingItem(todos, index, todos[index].isLiked);

    this.setState(() => ({ todos }));
  }

  handleAddComment(id, comment) {
    const { todos } = this.state;

    const index = this.toDoListOpreations.findToDoIndex(todos, id);
    const comments = todos[index].comments.push(comment);
    this.toDoListOpreations.commonUpdatingItem(todos, index, comments);

    this.setState(() => ({ todos }));
  }

  render() {
    const { todos } = this.state;
    return (
      <div>
        <Header />
        <section className="main-content blue-background">
          <div className="todo-container wrapper">
            <div className="todo-container-todos">
              <ToDoForm
                onTodoSubmit={this.handleAddItem}
              />
              <ToDoList
                todos={todos}
                onAddComment={this.handleAddComment}
                onLikeToDo={this.handleLikeItem}
                onRemoveToDo={this.handleRemovingItem}
                onSetReady={this.handleDone}
              />
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}
