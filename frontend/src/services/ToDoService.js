import { randomId } from '../utils';

export default class ToDoService {
  createToDo(title, description) {
    const now = new Date().now;
    return {
      id: randomId(),
      title,
      description,
      completed: false,
      createdDate: now,
      lastUpdatedDate: now,
      comments: [],
      createdByUserId: 1,
      isLiked: false,
      lastUpdatedByUserId: 1,
    };
  }
  updateTargetToDo(targetData, changes) {
    return {
      ...targetData,
      ...changes,
      lastUpdatedByUserId: USER_ID,
      lastUpdatedDate: new Date(),
      createdDate: targetData.createdDate,
      createdByUserId: targetData.createdByUserId,
    };
  }
}
