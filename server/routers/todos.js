const express = require('express');
const ControllerToDos = require('../controllers/Todos');
const TodoService = require('../services/ToDoService')
const TodoListService = require('../services/ToDoListService');

const router = express.Router();

const controllerToDo = new ControllerToDos();
const todoService = new TodoService();
const todoListService = new TodoListService(controllerToDo, todoService);

/**
 * routers
 * **/
/*router.get('/', service.getAuthors);*/
router.get('/:id', todoListService.createToDoItem);
/*router.put('/:id', service.updateAuthor);
router.delete('/:id', service.removeAuthor);*/

module.exports = router;