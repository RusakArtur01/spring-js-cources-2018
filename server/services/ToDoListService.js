module.exports = class ToDoListService {

  constructor(controllerToDo, todoService) {
    console.log('================');
    console.log('================');

    console.log(todoService);
    console.log('================');

    this.controllerToDo = controllerToDo;
    this.todoService = todoService;
  }

  /**
   * @param {Object} data
   * @param {string} data.title
   * @param {string} data.description
   * @return {Promise<string>}
   *
   */

  createToDoItem(data) {
    let todoId;
    /*this.controllerToDo.getAllToDo();*/
    console.log('addadada');
  }

  removeToDoItem(objData, id) {
    let result = [...objData];
    const index = this.findIndexByiD(result, id);
    result.splice(index, 1);
    return this.controllerToDo.saveAllToDos(result);
  }

  updateItem(objData, index, changes) {
    let updatedToDo = this.todoService.updateTargetToDo(objData[index], changes);
    let result = [...objData];

    result.splice(index, 1, updatedToDo);
    return this.controllerToDo.saveAllToDos(result);
  }

  findIndexByiD(data, id) {
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }
    return index;
  }

}
