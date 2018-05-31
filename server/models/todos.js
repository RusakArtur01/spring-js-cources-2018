const dao = require('../dao/mongoDAO');

module.exports.getAll = (callback) => {
  dao.get().collection('todos').find().toArray((err, result) =>{
    callback(err, result);
  });
};