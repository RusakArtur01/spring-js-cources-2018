const randomId = require('../utils');
module.exports = class ToDoService {
  createTodo(data) {
    const now = new Date();
    return {
      comment: [],
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
}
