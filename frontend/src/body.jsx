import React, {Component} from 'react';
import {List} from './list';
import {InputForm} from './imputForm';
import {data} from './storage';

export class Body extends Component {

  constructor(props) {
    super(props);
    this.state = {list: data};
    console.log(this.state);
    this.showComment = this.showComment.bind(this);
    this.handleDone = this.handleDone.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleLikeItem = this.handleLikeItem.bind(this);
    this.handleRemovingItem = this.handleRemovingItem.bind(this);
  }

  componentDidUpdate(){
    const updatedData = JSON.stringify(this.state.list);
    localStorage.setItem('list', updatedData);
  }

  handleAddItem({title, description}) {

    const {list} = this.state;

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

    this.setState(() => ({list: [...list, newItem]}));

  };

  handleRemovingItem(id) {

    const {list} = this.state;
    const index = list.findIndex((item) => {
      return item.id === id;
    });

    if (index >= 0) {
      console.log(id);
      list.splice(index, 1);
      this.setState(() => ({list: list}));
    }
  }

  handleDone(id){

    const {list} = this.state;

    list.map((item) => {
      if(item.id === id){
        item.completed = !item.completed;
      }
      return item;
    });

    this.setState(() => ({list: list}));
  }

  handleLikeItem(id) {

    const {list} = this.state;

    list.map((item) => {
      if (item.id === id) {
        item.isLiked = !item.isLiked;
      }
      return item;
    });

    this.setState((prevState) => ({list: list}));
  }

  showComment(id, comment) {

    const {list} = this.state;

    list.map((item) => {
      if (item.id === id)
        item.comments.push(comment);
      return item;
    });

    this.setState(() => ({list: list}));
  }

  render() {
    const {list} = this.state;
    return (
      <section className="main-content blue-background">
        <div className="todo-container wrapper">
          <div className="todo-container-todos">
            <InputForm
              handleAddItem={this.handleAddItem}
            />
            <List
              list={list}
              showComment={this.showComment}
              handleLikeItem={this.handleLikeItem}
              handleRemovingItem={this.handleRemovingItem}
              handleDone={this.handleDone}
            />
          </div>
        </div>
      </section>
    );
  }
}