#!/usr/bin/env node

const program = require('commander');
const {prompt} = require('inquirer');
const fs = require('fs');
const path = require('path');

program
    .version('0.0.1')
    .description('TODO app');

const STORAGE_PATH = path.resolve('./store.json');
const { O_APPEND, O_RDONLY, O_CREAT } = fs.constants;
const USER_ID = 1;


// Craft questions to present to users
const createQuestions = [
    {
        type: 'input',
        name: 'title',
        message: 'Enter title ...'
    },
    {
        type: 'input',
        name: 'description',
        message: 'Enter description ...'
    },
];
const updateQuestions = [
    {
        type: 'input',
        name: 'title',
        message: 'Enter new title ...'
    },
    {
        type: 'input',
        name: 'description',
        message: 'Enter new description ...'
    },
];
const commentQuestions = [
    {
        type: 'input',
        name: 'comment',
        message: 'Enter comment ...'
    },
];

//creating item info
function createToDo(objAnswers) {

    let now = new Date();

    return {
        id: randomId(),
        createdByUserId: USER_ID,
        lastUpdatedByUserId: USER_ID,
        createdDate: now,
        lastUpdatedDate: now,
        title: objAnswers.title,
        description: objAnswers.description,
        comment: null,
        liked: false
    }
}

function updateTargetToDo(targetData, changes) {
    return{
        ...targetData,
        ...changes,
        lastUpdatedByUserId: USER_ID,
        lastUpdatedDate: new Date(),
        createdDate: targetData.createdDate,
        createdByUserId: targetData.createdByUserId
    }
}

//add a todoitem in list
function updateToDoList(currentToDO, obj) {
    return [...obj, currentToDO];
}

//find the index for target id
function findToDoIndex(todos, id) {

    let index = todos.findIndex((currentToDo) => currentToDo.id === id);
    if(index === -1){
        return false;
    }
    return index;
}

//opening file, if file doesn't exist, it will be created
function openFile() {
    return new Promise((resolve, reject) => {
        fs.open(STORAGE_PATH, 'a+', (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

//reading file
function readFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(STORAGE_PATH, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            // check is document has data, will set the data
            if (!data) {
                data = {todos: []};
                data = JSON.stringify(data);
            }
            resolve(data);
        });
    });
}

//adding changes in file
function writeFile(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(STORAGE_PATH, data, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

//generation random id
function randomId() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }

    return s4();
    //return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

//saving todolist ( making json)
function saveTodoList(todos){
    return writeFile(JSON.stringify({todos}));
}

//getting json obj
function getObjJson() {
    return openFile()
        .then(() => {
            return readFile();
        });
}

//parse data to obj
function padrseData(jsonData) {
    let objData = JSON.parse(jsonData);
    return objData.todos;
}

//parse data to json
function stringifyData(objData) {
    return JSON.stringify(objData);
}

//print information in console
function print(obj) {
    console.info(obj);
}

//ready
program
    .command('create')
    .alias('cr')
    .description('Create new TODO item')
    .action(() => {

        let answers;

        prompt(createQuestions)
            .then((receivedAnswers) => {
                answers = receivedAnswers;
                return getObjJson();
            })
            .then(padrseData)
            .then((obj) => {
                let currentToDo = createToDo(answers);
                let updatedToDo = updateToDoList(currentToDo, obj);

                return saveTodoList(updatedToDo).then(() => currentToDo.id);
            })
            .then((id) => console.info(`Element with ID ${id} was added.`))
            .catch((e) => {
                throw e;
            });
    });

program
    .command('update <id>')
    .alias('upd')
    .description('Update TODO item')
    .action((id) => {

        let message = `Update was stopped, TODO item not found!!!`;
        let answers;

        prompt(updateQuestions)
            .then(updatedAnswers => {
                answers = updatedAnswers;
                return getObjJson();
            })
            .then(padrseData)
            .then((objData)=> {

                let isObjectIndex = findToDoIndex(objData,id);

                if(isObjectIndex === false){
                    return message;
                }

                let updatedToDo = updateTargetToDo(objData[isObjectIndex], answers);
                let result = [...objData];

                result.splice(isObjectIndex, 1, updatedToDo);
                saveTodoList(result);

                return `The TODO, which has ID: ${id} was updated!!!`;
            })
            .then(print)
            .catch((e) => {
                throw e;
            });
    });

program
    .command('remove <id>')
    .alias('rm')
    .description('Remove TODO item by id')
    .action((id) => {

        let message = `Removing was stopped, TODO item not found!!!`;

        return getObjJson()
            .then(padrseData)
            .then((objData) => {

                let isObjectIndex = findToDoIndex(objData, id);

                if (isObjectIndex === false) {
                    return message;
                }
                let result = [...objData];

                let removedItem = result.splice(isObjectIndex, 1);
                saveTodoList(result);

                return `Removed count: ${removedItem.length}`;
            })
            .then(print)
            .catch((e) => {
                throw e;
            });
    });

//print todos list
program
    .command('list')
    .alias('ls')
    .description('List all TODOs')
    .action(() => {
        getObjJson()
            .then(print)
            .catch((e) => {
                throw e;
            });
    });

//pring target todoelement
program
    .command('read <id>')
    .alias('rd')
    .description('Read TODO item')
    .action((id) => {

        let message = `TODO item not found`;

        getObjJson()
            .then(padrseData)
            .then((objData) => {
            //check data is message
                let isObjectIndex = findToDoIndex(objData,id);
                if(isObjectIndex === false){
                    return message;
                }
                return stringifyData(objData[isObjectIndex]);
            })
            .then(print)
            .catch((e) => {
                console.info(e);
            });
    });

program
    .command('like <id>')
    .alias('lk')
    .description('Like TODO item')
    .action((id) => {

        let message = `Liking was stopped, TODO item not found!!!`;

        return getObjJson()
            .then(padrseData)
            .then((objData) => {

                let isObjectIndex = findToDoIndex(objData, id);

                if (isObjectIndex === false) {
                    return message;
                }

                let updatedToDo = updateTargetToDo(objData[isObjectIndex], {liked: true});
                let result = [...objData];

                result.splice(isObjectIndex, 1, updatedToDo);
                saveTodoList(result);

                return `The TODO, which has ID: ${id} was Liked!!!`;
            })
            .then(print)
            .catch((e) => {
                throw e;
            });
    });

program
    .command('unlike <id>')
    .alias('unlk')
    .description('Like TODO item')
    .action((id) => {

        let message = `Unliking was stopped, TODO item not found!!!`;

        return getObjJson()
            .then(padrseData)
            .then((objData) => {

                let isObjectIndex = findToDoIndex(objData, id);

                if (isObjectIndex === false) {
                    return message;
                }

                let updatedToDo = updateTargetToDo(objData[isObjectIndex], {liked: false});
                let result = [...objData];

                result.splice(isObjectIndex, 1, updatedToDo);
                saveTodoList(result);

                return `The TODO, which has ID: ${id} was Unliked!!!`;
            })
            .then(print)
            .catch((e) => {
                throw e;
            });
    });

program
    .command('comment <id>')
    .alias('cmt')
    .description('Comment TODO item')
    .action((id) => {

        let message = `Commenting was stopped, TODO item not found!!!`;
        let answers;

        prompt(commentQuestions).then(updatedAnswers => {
            answers = updatedAnswers;
            return getObjJson();
        })
            .then(padrseData)
            .then((objData) => {

                let isObjectIndex = findToDoIndex(objData, id);

                if (isObjectIndex === false) {
                    return message;
                }

                let updatedToDo = updateTargetToDo(objData[isObjectIndex], answers);
                let result = [...objData];

                result.splice(isObjectIndex, 1, updatedToDo);
                saveTodoList(result);

                return `The TODO, which has ID: ${id} was commented!!!`;
            })
            .then(print)
            .catch((e) => {
                throw e;
            });
    });

program.parse(process.argv);
