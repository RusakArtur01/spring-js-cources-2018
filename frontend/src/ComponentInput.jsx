import React, { Component } from 'react';

export class ComponentInput extends Component{

  constructor(props){
    super(props);
    this.inputComment = this.inputComment.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.pressEnter = this.pressEnter.bind(this);
    this.state = {
      textValue: ''
    };
  }


  inputComment(e) {
    this.setState({textValue: e.target.value});
  };

  pressEnter(e){

    if(e.key == 'Enter'){

      e.preventDefault();
      if(this.state.textValue == '')
        return;
      this.props.sendComment(this.props.idOfItem, this.state.textValue);
      this.setState({textValue: ''});
    }
  }

  submitComment(e){
    e.preventDefault();
    if(this.state.textValue == '')
      return;
    this.props.sendComment(this.props.idOfItem, this.state.textValue);
    this.setState({textValue: ''});

  };

  render(){
    return(
      <div>
        <textarea
          className="form-container__input"
          placeholder="Add comment..."
          onChange={this.inputComment}
          onKeyDown={this.pressEnter}
          value={this.state.textValue}
        />
        <i className="far fa-plus-square" onClick={this.submitComment}/>
      </div>
    );
  }
}