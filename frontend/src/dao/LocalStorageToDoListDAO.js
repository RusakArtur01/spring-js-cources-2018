export default class LocalStorageToDoListDAO {

  /**
   * @return {TodoObject[]}
   */
  getAllToDos() {
    const todos = JSON.parse(window.localStorage.getItem('todos'));
    return Promise.resolve(todos || []);
  }

  saveAllToDos(todos) {
    try {
      window.localStorage.setItem('todos', JSON.stringify(todos));
    }
    catch (e) {
      return Promise.reject(e);
    }
    return Promise.resolve(todos);
  }
}