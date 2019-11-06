var mongoose = require('mongoose');

var userItemSchema = new mongoose.Schema({
   //define the schema - this can take place of the model
    user: String,
    item: Number,
    rating: Number,
    madeIt: Number
  });

module.exports = mongoose.model('UserItem', userItemSchema,'Feedback');
