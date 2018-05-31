import React, {Component} from 'react';
import ToDoItem from './ToDoItem';
import ToDoEmpty from './toDoEmpty';
import ToDoAddItem from '../form/ToDoAddItem';
import LocalStorageToDoListDAO from "../../dao/LocalStorageToDoListDAO";
import TodoService from "../../todos/services/ToDoService";
import ToDoListService from "../../todos/services/ToDoListService";

export default class ToDoList extends Component {


  constructor(props) {
    super(props);
    this.state = {
      todos: []
    };

    this.localStorageToDoListDAO = new LocalStorageToDoListDAO();
    this.toDoService = new TodoService();
    this.toDoListService = new ToDoListService(this.localStorageToDoListDAO, this.toDoService);

    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleLikeItem = this.handleLikeItem.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
  }

  componentDidMount() {
    this.localStorageToDoListDAO
      .getAllToDos()
      .then((todosList) => {
        this.setState({
          todos: todosList,
        });
      });
  }

  componentWillUnmount() {
    this.localStorageToDoListDAO
      .saveAllToDos(data)
      .then(() => console.log(`saved - App.js`));
  }

  /**
   * @param {Object} data
   * @return [Array] data
   * **/
  handleAddItem(data) {
    this.toDoListService
      .createToDoItem(data)
      .then( todos => { this.setState({
        todos
      });});
  }

  /**
   * @param {string] item id
   * return {void}
   * **/
  handleRemoveItem(id) {
    const {todos} = this.state;

    this.toDoListService
      .removeToDoItem(todos, id)
      .then( todos => { this.setState({
        todos
      });});
  }

  /**
   * @param {string] item id
   * return {void}
   * **/
  handleComplete(id) {
    const {todos} = this.state;

    const index = this.toDoListService.findIndexByiD(todos, id);
    todos[index].completed = !todos[index].completed;

    this.toDoListService
      .updateItem(todos, index)
      .then( todos => { this.setState({
        todos
      });});
  }

  /**
   * @param {string] item id
   * return {void}
   * **/
  handleLikeItem(id) {
    const {todos} = this.state;

    const index = this.toDoListService.findIndexByiD(todos, id);
    todos[index].isLiked = !todos[index].isLiked;

    this.toDoListService
      .updateItem(todos, index);

    this.setState(() => ({todos}));
  }

  /**
   * @param {string] item id
   * @param {string} comment
   * return {void}
   * **/
  handleAddComment(id, comment) {
    const {todos} = this.state;

    const index = this.toDoListService.findIndexByiD(todos, id);
    const comments = todos[index].comment.push(comment);

    this.toDoListService.updateItem(todos, index, comments);

    this.setState(() => ({todos}));
  }

  render() {
    const items = this.state.todos;

    if (!items || !items.length) {
      return (
        <div className="container__lists">
          <ToDoAddItem onTodoSubmit={this.handleAddItem}/>
          <ToDoEmpty title={'Empty list'}/>
        </div>
      );
    }
    return (
      <div className="container__lists">
        <ToDoAddItem
          onTodoSubmit={this.handleAddItem}
        />
        <ul className="common-list">
          {items.map((item, index) => (
            <ToDoItem
              {...item}
              key={item.id}
              title={item.title}
              description={item.description}
              comments={item.comment}
              onLikeToDo={this.handleLikeItem}
              onComplete={this.handleComplete}
              onRemoveToDo={this.handleRemoveItem}
              onAddComment={this.handleAddComment}
            />
          ))}
        </ul>
      </div>
    );
  }
}
