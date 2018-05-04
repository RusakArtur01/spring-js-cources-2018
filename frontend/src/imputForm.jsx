import React, { Component } from 'react';

export class InputForm extends Component{

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: ''
    };

    this.handleInputItem = this.handleInputItem.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
  }

  handleInputItem(event){

    const name = event.target.name;
    const value = event.target.value;

    if(name === 'title'){
      this.setState((prevstate) => ({title: value}));
    }
    if(name === 'description'){
      this.setState((prevstate) => ({description: value}));
    }


  }

  handleSubmitForm(event){
    if(this.state.title !==''){
      const newItem = this.state;
      this.props.handleAddItem(newItem);

    }

    this.setState({
      title: '',
      description: ''
    });
    event.preventDefault();
  }



  render(){
    return(
      <div className="add-item-component form-container text-center margin-bottom20">
        <form onSubmit={this.handleSubmitForm}>
          <input
            className="form-container__input"
            name="title"
            onChange={this.handleInputItem}
            placeholder="Input title..."
            value={this.state.title}
          />
          <textarea
            className="form-container__input"
            name="description"
            onChange={this.handleInputItem}
            placeholder="Input title..."
            value={this.state.description}
          />
          <button className="form-container__add-button" type="submit">Add ToDo</button>
        </form>
      </div>
    );
  }
}