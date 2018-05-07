import React, {Component} from 'react';
import {ChangeData} from './ChangeData';

export class ToDoItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCommentInputVisible: false
    };

    this.like = this.like.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.makeDone = this.makeDone.bind(this);
  };


  toggleCommentInputVisibility(e) {
    e.preventDefault();
    this.setState((prevState) => ({isCommentInputVisible: !prevState.isCommentInputVisible}));
  };

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
    this.props.onSetReady(this.props.id);
  }

  render() {
    const {
      title,
      description,
      comments,
      id,
      onAddComment
    } = this.props;
    return (
      <li>
        <i className="fas fa-trash-alt" onClick={this.removeItem}/>
        <span className="done" onClick={this.makeDone}>done</span>
        <p className="title"><span className="title__name">Title:</span> {title}</p>
        <p className="description">{description != '' &&
        <span className="description__name">Description:</span>}{description}</p>
        <div className="comments">
          {
            comments &&
            (<p>Comments</p>, <ul>{comments.map(comment => <li>{comment}</li>)}</ul>)
          }
        </div>

        {
          this.props.isLiked ?
            (<i className="fa fa-heart liked" onClick={this.like}/>) : (
              <i className="fa fa-heart" onClick={this.like}/>)
        }

        <a href="#" onClick={this.toggleCommentInputVisibility.bind(this)} className="addComment">
          {this.state.isCommentInputVisible ? 'Close input' : 'Add comment'}
        </a>

        {
          this.state.isCommentInputVisible && <ChangeData todoId={id} onAddComment={onAddComment}/>
        } {/*if true - show*/}
      </li>
    );
  }
}