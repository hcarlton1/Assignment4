var feedbackSchema = require('./userItem.js');
let UserItem = require('./userItem.js');
var ItemDB = require('./itemDB.js');
let usersItemFeedback = {};
usersItemFeedback["1"] = [{ itemId: "1", rating: 4, flag: "No" },
{ itemId: "4", rating: 1, flag: "Yes" }];

let insert = function (userID, userItem) {


    let userItems = usersItemFeedback[userID]

    if (typeof userItems != 'undefined') {
        for (dbUserItem in userItems) {
            if (userItem.itemId == dbUserItem.itemId) {
                return false;
            }
        }

        userItems.push({ itemId: userItem.getItem().getItemCode(), rating: userItem.getRating, flag: userItem.getMadeIt() });
    }
};


let selectUserItems = function (userID) {

    let userItemsDB = usersItemFeedback[userID]

    let userItems = [];
    if (typeof userItemsDB != 'undefined') {
        for (let i = 0; i < userItemsDB.length; i++) {
          userItem = new UserItem();
          userItem.setItem(ItemDB.getItem(userItemsDB[i].itemId));
          userItem.setRating(userItemsDB[i].rating);
          userItem.setMadeIt(userItemsDB[i].flag);
          userItems.push(userItem);
        }
    }
    return userItems;
};

let update = function (userID, userItem) {
    let userItemRatings = userItemRating[userID];
    let userItemFlags = userItemFlag[userID];

    let itemId;
    for (let i = 0; i < userItemRatings.length; i++) {
        itemId = userItemRatings[i].split(",")[0];
        if (itemId == userItem.item.itemCode) {

            userItemRatings = userItemRatings.slice(i, 1);
            userItemRatings.push(itemId + "," + userItem.getRating());
            userItemFlags.push(itemId + "," + userItem.getMadeIt());


            userItemRating.put(userID, userItemRatings);
            userItemFlag.put(userID, userItemFlags);


            return true;
        }
    }

    return false;
};

let removeItem = function (userID, itemCode) {

    let userItemRatings = userItemRating[userID];
    let userItemFlags = userItemFlag[userID];

    let itemId;
    for (let i = 0; i < userItemRatings.lenght; i++) {
        itemId = userItemRatings[i].split(",")[0];
        if (temId == itemCode) {

            userItemRatings = userItemRatings.slice(i, 1);
            userItemFlags = userItemFlags.slice(i, 1);


            userItemRating[userID] = userItemRatings;
            userItemFlag[userID] = userItemFlags;


            return true;
        }
    }

    return false;
};

module.exports.insert = insert;
module.exports.selectUserItems = selectUserItems;
module.exports.update = update;
module.exports.removeItem = removeItem;
