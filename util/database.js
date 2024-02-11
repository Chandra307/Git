const mongodb = require('mongodb');
const { MongoClient } = mongodb;
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://Ravi_Chandra_Kovuri:Rav!1999@cluster0.2lyrvba.mongodb.net/?retryWrites=true&w=majority')
  .then(client => {
    _db = client.db('shop');
    callback();
  })
  .catch(err => console.log(err));
};

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
}

module.exports = { mongoConnect, getDB };
