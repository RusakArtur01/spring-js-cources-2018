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

function createToDo(answers) {

    console.log(answers.title + " => test 3 get for create TODO");

    let now = new Date();

    return {
        id: randomId(),
        createdByUserId: USER_ID,
        updatedByUserId: USER_ID,
        createdDate: now,
        updatedDate: now,
        title: answers.title,
        description: answers.description
    }
}

function updateToDo(currentToDO, obj) {
    return [...obj, currentToDO];
}

function findToDoIndex(todos, id) {
    return todos.findIndex(() => {todos.id == id});
}

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

function randomId() {
    function s4() {
        // return Math.floor((1 + Math.random()) * 0x10000)
        //   .toString(16)
        //   .substring(1);
        //--------------------------------------------
        // for testing we will use simple id.
        return Math.floor(Math.random() * (20 - 1) + 1);

    }

    return s4();
    //return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function saveTodoList(obj){
    return writeFile(JSON.stringify(obj));
}

function getParseObjJson() {
    return openFile()
        .then(() => {
            return readFile();
        });
}

function padrseData(data) {
    console.log(data + ' => test1 parsing');
    return JSON.parse(data);
}

function print(obj) {
    console.info(obj);
}

program
    .command('create')
    .alias('cr')
    .description('Create new TODO item')
    .action(() => {

        let answers;

        prompt(createQuestions)
            .then((receivedAnswers) => {
                answers = receivedAnswers;
                return getParseObjJson();
            })
            .then(padrseData)
            .then((obj) => {

                let currentToDo = createToDo(answers);
                let updatedToDoList = updateToDo(currentToDo, obj);

                return saveTodoList(updatedToDoList).then(() => currentToDo.id);
            })
            .then((id) => console.info(`Element with ID ${id} was added.`))
            .catch((error) => {
                console.error(`error: ${error}`);
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
            return getParseObjJson()
                .then((obj) => {

                    var flag = false;// boolean for add new task
                    // check is array has element with current id
                    obj.todos.find(el => {
                        if (el.id == getId) {
                            flag = true;
                            el.title = answers.title;
                            el.description = answers.description;
                        }
                    });

                    //if array haven't element with current id, we will add new task
                    if (!flag) {
                        obj.todos.push({
                            id: randomId(),
                            title: answers.title,
                            description: answers.description,
                        });
                    }

                    return saveTodoList(obj);
                })
                .catch((error) => {
                    console.error(`error: ${error}`);
                });
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

program
    .command('list')
    .alias('ls')
    .description('List all TODOs')
    .action(() => {
        getParseObjJson()
            .then(print);
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
