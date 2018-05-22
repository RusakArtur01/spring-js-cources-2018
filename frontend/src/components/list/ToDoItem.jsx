import React, { Component } from 'react';
import ToDoEdit from '../form/ToDoEdit';

export default class ToDoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCommentInputVisible: false,
    };

    this.like = this.like.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.makeDone = this.makeDone.bind(this);
  }


  toggleCommentInputVisibility(e) {
    e.preventDefault();
    this.setState(prevState => ({ isCommentInputVisible: !prevState.isCommentInputVisible }));
  }

  like(e) {
    e.preventDefault();
    this.props.onLikeToDo(this.props.id);
  }

  removeItem(e) {
    e.preventDefault();
    this.props.onRemoveToDo(this.props.id);
  }

  makeDone(e) {
    e.preventDefault();
    this.props.onComplete(this.props.id);
  }

  render() {
    const {
      title,
      description,
      comments,
      id,
      onAddComment,
      isLiked,
      completed
    } = this.props;
    return (
      <li className={completed ? 'ready' : 'in-progress'}>
        <i className="fa fa-trash-alt" onClick={this.removeItem} />
        <p className="title"><span className="title__name">Title:</span> {title}</p>
        <p className="description">{description != '' &&
        <span className="description__name">Description:</span>}{description}
        </p>
        <div className="comments">
          {
            comments &&
            (<p>Comments</p>, <ul>{comments.map(comment => <li>{comment}</li>)}</ul>)
          }
        </div>

        {
          isLiked ?
            (<i className="fa fa-heart liked" onClick={this.like} />) : (
              <i className="fa fa-heart" onClick={this.like} />)
        }

        <a href="#" onClick={this.toggleCommentInputVisibility.bind(this)} className="addComment">
          {this.state.isCommentInputVisible ? 'Close input' : 'Add comment'}
        </a>

        {
          this.state.isCommentInputVisible && <ToDoEdit todoId={id} onAddComment={onAddComment} />
        } {/* if true - show */}

        {completed ? (<p className="done done-true" onClick={this.makeDone}>Done</p>) : (<p className="done" onClick={this.makeDone}>Done</p>)}
      </li>
    );
  }
}
