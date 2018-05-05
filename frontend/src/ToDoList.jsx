import React from 'react';
import {ToDoItem} from './ToDoItem';
import {EmptyList} from './emptyToDoList';

export const ToDoList = ({todos, onAddComment, onLikeToDo, onRemoveToDo, onSetReady}) => {


  let todoList
  //checking count of Items
  if (todos.length > 0) {
    todoList = todos.map((item) => (
      <ul className="common-list">
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
      </ul>
    ))
  }
  else {
    todoList =
      <EmptyList
        title="The list is empty."
      />
  }

  return (
    <div className="container__lists">

      {todoList}
      <span className={todos.length > 0 ? '' : 'none'}>All todos: {todos.length}</span>
    </div>
  );
};