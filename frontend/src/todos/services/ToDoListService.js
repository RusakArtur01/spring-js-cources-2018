export default class ToDoListService {

  constructor(localStorageToDoListDAO, todoService) {
    this.todosListDAO = localStorageToDoListDAO;
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

    return this.todosListDAO.getAllToDos()
      .then((todos) => {
        const todo = this.todoService.createTodo(data);
        todoId = todo.id;
        const result = [...todos, todo];
        this.todosListDAO.saveAllToDos(result);
        return result;
      });
  }

  removeToDoItem(objData, id) {
    let result = [...objData];
    const index = this.findIndexByiD(result, id);
    result.splice(index, 1);
    return this.todosListDAO.saveAllToDos(result);
  }

  updateItem(objData, index, changes) {
    let updatedToDo = this.todoService.updateTargetToDo(objData[index], changes);
    let result = [...objData];

    result.splice(index, 1, updatedToDo);
    return this.todosListDAO.saveAllToDos(result);
  }

  findIndexByiD(data, id) {
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }
    return index;
  }

}
