const Methods = require('./Methods');

module.exports = class Todos extends Methods{

  create(todoItem) {
    super.create(todoItem);
  }

  update(todoItem) {
    super.update(todoItem);
  }

  remove(todoItem) {
    super.remove(todoItem);
  }

  getById(id) {
    super.getById(id);

  }

  removeById(id) {
    super.removeById(id);
  }

  getAllToDo() {
    console.log('getAll');
  }
};