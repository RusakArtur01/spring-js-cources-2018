import React, { Component } from 'react';

export default class ToDoAddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.title !== '') {
      this.props.onTodoSubmit(this.state);
      this.setState({
        title: '',
        description: '',
      });
    }
  }


  render() {
    return (
      <div className="add-item-component form-container text-center margin-bottom20">
        <form onSubmit={this.handleSubmit}>
          <input
            className="form-container__input"
            name="title"
            onChange={this.handleChange}
            placeholder="Input title..."
            value={this.state.title}
          />
          <textarea
            className="form-container__input"
            name="description"
            onChange={this.handleChange}
            placeholder="Input description..."
            value={this.state.description}
          />
          <button className="form-container__add-button" type="submit">Add ToDo</button>
        </form>
      </div>
    );
  }
}
