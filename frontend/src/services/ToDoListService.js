export default class ToDoListService{

  getAllToDos(){

    const todos = JSON.parse(window.localStorage.getItem('todos'));
    return Promise.resolve(todos || []);
  }

  removeToDoItem(objData, index){

    let result = [...objData];
    return result.splice(index, 1);
  }

  //find the index for target id
  findToDoIndex(todos, id) {

    let index = todos.findIndex((currentToDo) => currentToDo.id === id);
    return index;
  }

  saveTodoList(data){
    const updatedData = JSON.stringify(data);
    localStorage.setItem('todos', updatedData);
  }

  //common function for updating
  commonUpdatingItem(objData, index, changes) {
    let updatedToDo = this.updateTargetToDo(objData[index], changes);
    let result = [...objData];

    return result.splice(index, 1, updatedToDo);
  }

//updating targettodo
  updateTargetToDo(targetData, changes) {
    return{
      ...targetData,
      ...changes,
      lastUpdatedByUserId: 1,
      lastUpdatedDate: new Date().now,
      createdDate: targetData.createdDate,
      createdByUserId: targetData.createdByUserId
    }
  }
}