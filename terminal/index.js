#!/usr/bin/env node

const program = require('commander');
const {prompt} = require('inquirer');
const fs = require('fs');
const path = require('path');

program
    .version('0.0.1')
    .description('TODO app');

const storagePath = path.resolve('./store.json');

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


function openFile() {
    return new Promise((resolve, reject) => {
        fs.open(storagePath, 'a+', (err, fd) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(fd);
        });
    });
}

function readFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(storagePath, 'utf8', (err, data) => {
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
        fs.writeFile(storagePath, data, (err) => {
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
        })
        .then((data) => {
            return JSON.parse(data);
        });
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
                return getParseObjJson()
                    .then((obj) => {
                        obj.todos.push({
                            id: randomId(),
                            title: answers.title,
                            description: answers.description,
                        });
                        return saveTodoList(obj);
                    })
                    .catch((error) => {
                        console.error(`error: ${error}`);
                    });
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
        return getParseObjJson()
            .then((obj) => {
                obj.todos.forEach((el, i) => {
                    console.log(`_${i + 1}__________________________________________________________________________________`);
                    for (key in el) {
                        console.log(` ${key}: ${el[key]}`);
                    }
                });
            });
    });

program
    .command('like <id>')
    .alias('lk')
    .description('Like TODO item')
    .action((id) => {
        // TODO mark todo item as liked
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
