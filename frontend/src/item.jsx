import React, {Component} from 'react';
import {ChangeData} from './ChangeData';

export class Item extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.like = this.like.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.makeDone = this.makeDone.bind(this);
  };


  addComment(e) {
    this.setState((prevState) => ({visible: !prevState.visible}));
    e.preventDefault();
  };

  like(e) {
    this.setState((prevState) => ({like: !prevState.like}));
    this.props.handleLikeItem(this.props.id);
    e.preventDefault();
  }

  removeItem(e) {
    this.props.handleRemovingItem(this.props.id);
    e.preventDefault();
  }

  makeDone(e) {
    this.props.handleDone(this.props.id);
    e.preventDefault();
  }

  render() {
    const {
      title,
      description,
      comments,
      id,
      sendComment
    } = this.props;
    return (



      <li>
        <i className="fas fa-trash-alt" onClick={this.removeItem}/>
        <span className="done" onClick={this.makeDone}>done</span>
        <p className="title"><span className="title__name">Title:</span> {title}</p>
        <p className="description">{description != '' && <span className="description__name">Description:</span>}{description}</p>
        <div className="comments">
          {comments.map((comment) => <p key={new Date()}><span className="comments__name">Comment(s):</span>{comment}</p>)}
        </div>

        {
          this.props.isLiked ?
            (<i className="fa fa-heart liked" onClick={this.like}/>) : (
              <i className="fa fa-heart" onClick={this.like}/>)
        }

        <a href="#" onClick={this.addComment.bind(this)} className="addComment">
          {this.state.visible ? 'Close input' : 'Add comment'}
        </a>

        {
          this.state.visible && <ChangeData idOfItem={id} sendComment={sendComment}/>
        } {/*if true - show*/}
      </li>
    );
  }
}