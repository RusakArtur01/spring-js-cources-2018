import React from 'react';
import {Item} from './item';
import {EmptyList} from './emptyToDoList';

export const List = ({list, showComment, handleLikeItem, handleRemovingItem, handleDone}) => {

  let data = {list}.list;
  let todoList;
  console.log(`data in list component --> ${list}`);
  //checking count of Items
  if(data.length > 0){
    todoList = data.map((item) => (
      <Item
        {...item}
        key = {item.id}
        title = {item.title}
        description = {item.description}
        comments = {item.comments}
        sendComment = {showComment}
        handleLikeItem = {handleLikeItem}
        handleRemovingItem = {handleRemovingItem}
        handleDone = {handleDone}
      />
    ))
  }
  else{
    todoList =
      <EmptyList
        title="The list is empty."
      />
  }

  return(
    <div className="container__lists">
      <ul className="common-list">
        {todoList}
      </ul>
      <span className={data.length > 0 ? '' : 'none'}>All todos: {data.length}</span>
    </div>
  );
};