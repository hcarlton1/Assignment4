//April 2nd update
const Item = require('../Models/item');
const UserItems = require('../Models/UserItemDB');

//gets all items by category
let getItems = function (category) {
    return new Promise((resolve, reject) => {
        Item.find({
            category: category
        }).then(data => {
            resolve(data);
        }).catch(err => {
            return reject(err);
        })
    })
}

//gets a specific item by itemCode
let getItem = function (itemCode) {
    return new Promise((resolve, reject) => {
        console.log("Item got was: " + itemCode);
        Item.findOne({
            code: itemCode
        }).exec().then(data => {
            resolve(data);
        }).catch(err => {
            return reject(err);
        })
    })
}
module.exports.getItems = getItems;
module.exports.getItem =  getItem;
