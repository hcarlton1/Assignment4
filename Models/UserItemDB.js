const UserItem = require('../Models/userItem');


let addItem = function (userID, itemCode) {
console.log("UserID is: ");
console.log(userID);
  return new Promise((resolve, reject) => {
    UserItem.findOneAndUpdate({ $and: [{ user: userID }, { item: itemCode }] },
      { $set: { user: userID, item: parseInt(itemCode), rating: 0, madeIt:0 } },
      { new: true, upsert: true }, function (err, data) {
        console.log(data);
        resolve(data);
      }).catch(err => { return reject(err); });
  })
};

let selectUserItems = function (userID) {
  return new Promise((resolve, reject) => {
    UserItem.find({ user: userID }).then(data => {
      console.log("In selectUserItems all:  " + data);
      resolve(data);
    }).catch(err => { return reject(err); })
  })
}


let findByID = function (userID, itemCode) {
  return new Promise((resolve, reject) => {
    UserItem.find({
      $and: [{ user: userID }, { item: itemCode }]
    }).then(data => {
      resolve(data);
    }).catch(err => {
      return reject(err);
    })
  });
}

let updateItem = function (userID, userItem) {
  return new Promise((resolve, reject) => {
    UserItem.findOneAndUpdate({ $and: [{ user: userID }, { item: userItem.item.code }] },
      { $set: { user: userID, item: userItem.item.code, rating: userItem.rating, madeIt: userItem.madeIt } },
      { new: true, upsert: true }, function (err, data) {
        console.log(data);
        resolve(data);
      }).catch(err => { return reject(err); });
  }
  )
}


let updateItemRating = function (userID, itemID, rating) {
  return new Promise((resolve, reject) => {
    UserItem.findOneAndUpdate({ $and: [{ user: userID }, { item: itemID }] },
      { $set: { rating: rating } },
      { new: true, upsert: true }, function (err, data) {
        console.log(data);
        resolve(data);
      }).catch(err => { return reject(err); });
  })
}

let updateItemFlag = function (userID, itemCode, madeItParam) {
  return new Promise((resolve, reject) => {
    console.log("UserID who is updating item is:  "+userID)

    UserItem.findOneAndUpdate({ $and: [{ user: userID }, { item: itemCode }] },
      { $set: { madeIt: madeItParam } }, function (err, data) {
        console.log("UpdateItemFlag: "+data);
        resolve(data);
      }).catch(err => {
        console.log("UpdateItemFlag ERROR");
      return reject(err); });
  }
  )
}


let remove = function (theUser, itemCode) {
  return new Promise((resolve, reject) => {
    UserItem.find({ $and: [{ user: theUser }, { item: itemCode }] }).remove().exec().then(function () {
      resolve()
    }).catch(err => { return reject(err); })

  });
}



let selectItemsForAvg = function (itemCode) {
  return new Promise((resolve, reject) => {
    UserItem.find({ item: itemCode }).then(data => {
      console.log("In selectUserItems all:  " + data);
      resolve(data);
    }).catch(err => { return reject(err); })
  })
}

module.exports.addItem = addItem;
module.exports.selectUserItems = selectUserItems;
module.exports.findByID = findByID;
module.exports.updateItem = updateItem;
module.exports.updateItemRating = updateItemRating;
module.exports.updateItemFlag = updateItemFlag;
module.exports.remove = remove;
module.exports.selectItemsForAvg = selectItemsForAvg;
