//April 2 update
const User = require('./user.js');
//gets all users
let getUsers = function () {
     return new Promise((resolve, reject) => {
         User.find().then(data => {
             resolve(data);
         }).catch(err => {
             return reject(err);
         })
     })
 }

//getting user by specific email
let getUser = function (userEmail) {
     return new Promise((resolve, reject) => {
         User.findOne({
             email: userEmail
         }).exec().then(data => {
             console.log("User's email is:  "+userEmail);
             resolve(data);
         }).catch(err => {
             return reject(err);
         })
     })
 }
module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
