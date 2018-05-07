import React, { Component } from 'react';

export class ChangeData extends Component{

  constructor(props){
    super(props);
    this.handleInputComment = this.handleInputComment.bind(this);
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.state = {
      textValue: ''
    };
  }

  handleInputComment(e) {
    this.setState({textValue: e.target.value});
  };

  handleKeyDown(e){
    if(e.key == 'Enter'){
      this.handleSubmitComment(e);
    }
  }

  handleSubmitComment(e){
    e.preventDefault();
    const { textValue } = this.state;
    if(textValue == '')
      return;
    this.props.onAddComment(this.props.todoId, textValue);
    this.setState({textValue: ''});

  };

  render(){
    return(
      <div>
        <textarea
          className="form-container__input"
          placeholder="Add comment..."
          onChange={this.handleInputComment}
          onKeyDown={this.handleKeyDown}
          value={this.state.textValue}
        />
        <i className="far fa-plus-square" onClick={this.handleSubmitComment}/>
      </div>
    );
  }
}