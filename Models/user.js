//exports and returns the values declared above
//database userSchema
var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

var userSchema = new mongoose.Schema({
    firstName: {type: String, default: 'firstName'},
    lastName: {type: String, default: 'lastName'},
    email: {type: String, default: 'email'},
  });

module.exports = mongoose.model('User', userSchema,'Users');
// module.exports = User;
