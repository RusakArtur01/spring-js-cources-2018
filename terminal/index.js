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

    console.log(objAnswers.title + " => test 3 get for create TODO");

    let now = new Date();

    return {
        id: randomId(),
        createdByUserId: USER_ID,
        updatedByUserId: USER_ID,
        createdDate: now,
        updatedDate: now,
        title: objAnswers.title,
        description: objAnswers.description
    }
}

//find target todoitem
function findTargetToDo(objData, id, message) {

    let index = findToDoIndex(objData, id);
    if(index === -1){
        return message;
    }
    return objData[index];
}

//add a todoitem in list
function updateToDo(currentToDO, obj) {
    return [...obj, currentToDO];
}

//find the index for target id
function findToDoIndex(todos, id) {
    return todos.findIndex((currentToDo) => currentToDo.id === id);
}

//opening file, if file doesn't exist, it will be created
function openFile() {
    return new Promise((resolve, reject) => {
        fs.open(STORAGE_PATH, 'a+', (err, fd) => {
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
                writeFile(data);
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
function saveTodoList(obj){
    return writeFile(JSON.stringify(obj));
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
    return JSON.parse(jsonData);
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
                let updatedToDoList = updateToDo(currentToDo, obj);

                return saveTodoList(updatedToDoList).then(() => currentToDo.id);
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

        let getId = id;
        let answers;

        prompt(updateQuestions).then(updatedAnswers => {
            answers = updatedAnswers;
            return getObjJson();
        })
        .then(padrseData)
        .then((obj) => {

            let currentToDo = createToDo(answers);
            let updatedToDoList = updateToDo(currentToDo, obj);

            return saveTodoList(updatedToDoList).then(() => currentToDo.id);
        })
        .then((id) => console.info(`Element with ID ${id} was added.`))
        .catch((e) => {
            throw e;
        });
    });

program
    .command('remove <id>')
    .alias('rm')
    .description('Remove TODO item by id')
    .action((id) => {

        let getId = parseInt(id, 10);

        return getParseObjJson()
            .then((obj) => {

                //get new array without unnecessary element
                obj.todos = obj.todos.filter((el) => {
                    return getId != el.id;
                });

                return saveTodoList(obj);
            })
            .catch((error) => {
                console.error(`error: ${error}`);
            });
    });

//ready
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
//ready
program
    .command('read <id>')
    .alias('rd')
    .description('Read TODO item')
    .action((id) => {

        let message = `TODO item not found`;

        getObjJson()
            .then(padrseData)
            .then((objData) => findTargetToDo(objData, id, message))
            .then((info) => {
            //check data is message
                if(typeof info == "string"){
                    return info;
                }
                return stringifyData(info);
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

        let getId = parseInt(id, 10);
        return getParseObjJson()
            .then((obj) => {
                obj.todos.find(el => {
                    if (el.id == getId) {
                        el.liked = 'true';
                    }
                });
                return saveTodoList(obj);
            })
            .catch((error) => {
                console.error(`error: ${error}`);
            });
    });

program
    .command('comment <id>')
    .alias('cmt')
    .description('Comment TODO item')
    .action((id) => {

        let comment;
        let getId = parseInt(id, 10);

        prompt(commentQuestions).then(userComment => {

            comment = userComment;
            return getParseObjJson()
                .then((obj) => {
                    obj.todos.find(el => {
                        if (el.id == getId) {
                            el.comment = comment.comment;
                        }
                    });
                    return saveTodoList(obj);
                })
                .catch((error) => {
                    console.error(`error: ${error}`);
                });
        });
    });

program.parse(process.argv);
