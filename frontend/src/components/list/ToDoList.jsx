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

  handleRemoveItem(id) {
    const {todos} = this.state;

    this.toDoListService
      .removeToDoItem(todos, id)
      .then( todos => { this.setState({
        todos
      });});
  }

  handleComplete(id) {
    const {todos} = this.state;
    const index = this.toDoListService.findIndexByiD(todos, id);

    todos[index].completed = !todos[index].completed;

    this.toDoListService
      .updateItem(todos, id)
      .then( todos => { this.setState({
        todos
      });});
  }

  handleLikeItem(id) {
    const {todos} = this.state;

    const index = this.ToDoListService.findToDoIndex(todos, id);
    todos[index].isLiked = !todos[index].isLiked;
    this.ToDoListService.commonUpdatingItem(todos, index, todos[index].isLiked);

    this.setState(() => ({todos}));
  }

  handleAddComment(id, comment) {
    const {todos} = this.state;

    const index = this.ToDoListService.findToDoIndex(todos, id);
    const comments = todos[index].comments.push(comment);
    this.ToDoListService.commonUpdatingItem(todos, index, comments);

    this.setState(() => ({todos}));
  }

  /*
    if(this.props.todos > 0) {
    todoList =
      todos.map(item => (
        <div>
          <ToDoAddItem
            onTodoSubmit={this.handleAddItem}
          />
          <ToDoItem
            {...item}
            key={item.id}
            title={item.title}
            description={item.description}
            comments={item.comments}
            onAddComment={onAddComment}
            onLikeToDo={onLikeToDo}
            onRemoveToDo={onRemoveToDo}
            onSetReady={onSetReady}
          />
        </div>
      ));
  }
  else
  {
    todoList =
      (<ToDoEmpty
        title="The list is empty."
      />);
  }*/
  render() {
    const items = this.state.todos;

    if (!items || !items.length) {
      return (<ToDoEmpty title={'Empty list'}/>);
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
              comments={item.comments}
              onComplete={this.handleComplete}
              onRemoveToDo={this.handleRemoveItem}
            />
          ))}
        </ul>
      </div>
    );
  }
}
