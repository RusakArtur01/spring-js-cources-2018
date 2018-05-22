import randomId from '../../utils';
export default class ToDoService {
  createTodo(data) {
    const now = new Date();
    return {
      comment: null,
      createdDate: now,
      createdByUserId: 1,
      completed: false,
      id: randomId(),
      isLiked: false,
      lastUpdateDate: now,
      lastUpdateByUserId: 1,
      ...data,
    };
  }
  updateTargetToDo(targetData, changes) {
    return{
      ...targetData,
      ...changes,
      lastUpdatedByUserId: 1,
      lastUpdatedDate: new Date(),
      createdDate: targetData.createdDate,
      createdByUserId: targetData.createdByUserId
    }
  }
  updateTodo(change, todo) {
    return {
      ...todo,
      ...change,
      lastUpdateDate: new Date(),
      lastUpdateByUserId: 1,
      createdDate: todo.createdDate,
      createdByUserId: todo.createdByUserId,
    };
  }
}
