const express = require('express');
const todos = require('./routers/todos');
const bodyParser = require('body-parser');
var dao = require('./dao/mongoDAO');

const app = express();
const PORT = 3000;

/**
 * Middleware
 **/
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/todos', todos);
app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}!`);
});
/*dao.connect('mongodb://localhost:27017/todos', (err) => {
  if (err){
    console.error(err);
  }

});*/

