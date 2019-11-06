var express = require('express');
var router = express.Router();
let UserDB = require('../Models/userDB');
let UserItemDB = require('../Models/UserItemDB');
let ItemDB = require('../Models/itemDB');
let UserProfile = require('../Models/userProfile');
let UserItemObj = require('../Models/UserItemObj');

var session = require('express-session');
var cookieParser = require('cookie-parser');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/assignment4', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log('connection succesful');
});


router.use(cookieParser());
router.use(session({
  secret: "nbad session secret"
}));


router.all('/profile', async (request, response, next) => {
  console.log("profile all request");
  //checking to see if session has begun
  let sessionProfile = request.session.currentProfile;
  console.log(sessionProfile);

  let action = request.query.action;
  console.log("user profile action " + action);

  if (typeof sessionProfile != 'undefined') { //session has started

    //add user to view
    response.locals.theUser = request.session.theUser;

  } else { //session hasnt started


    //get a user as if they logged in
    let theUser = await UserDB.getUser("hcarlton@uncc.edu");
    request.session.theUser = theUser;
    console.log("user added to sesion " + theUser);

    response.locals.theUser = request.session.theUser;

    action = "showProfile";
    let userProfile = new UserProfile();
    let userItems = await UserItemDB.selectUserItems("hcarlton@uncc.edu");
    let userItemsArr = [];

    if (userItems.length >= 1) {
      userItemsArr = await makeProfileItemsForView(userItems);
      userProfile.setItems(userItemsArr);
      request.session.currentProfile = userProfile.getItems();
    }
  }
  next();
});

router.get('/profile', async (request, response) => {
  console.log("profile get request");

  let sessionProfile = request.session.currentProfile;

  let action = request.query.action;
  console.log("user profile GET action " + action);

  if (typeof sessionProfile == 'undefined') {


    //get a user as if they logged in
    let theUser = UserDB.getUser("hcarlton@uncc.edu");
    request.session.theUser = theUser;
    console.log("user added to sesion " + theUser);

    action = "showProfile";
    let userProfile = new UserProfile();
    let userItems = await UserItemDB.selectUserItems("hcarlton@uncc.edu");
    if (userItems.length >= 1) {

      userProfile.setItems(userItems);
      request.session.currentProfile = userProfile;
    }
    console.log(userProfile);
  }


  console.log("updated session properties: " + JSON.stringify(request.session));
  if (action == null || action == "" || action == "showProfile") {
    respData = await showProfile(request, response);
    return response.render(respData.view, {
      data: respData.data
    });
  } else if (action == "signout") {

    console.log("signout");
    request.session.destroy();
    //remove user
    delete response.locals.theUser;
    return response.render('index');
  }

  let userProfile = request.session.currentProfile;
  if (userProfile == null || userProfile.length == 0) {
    request.emptyProfile = "Your profile is empty";
  }
  response.locals.theUser = request.session.theUser;

  return response.render('myItems', {
    data: request.session.currentProfile
  });
});

//holds the action parameters
router.post('/profile', async function(request, response) {
  let action = request.body.action;
  console.log("user profile function requested " + action);

 if (action == null || action == "" || action == "showProfile") {
    respData = showProfile(request, response);
  } else if (action == "update") {
    respData = await updateProfile(request, response);
  } else if (action == "save") {
    respData = await updateProfileSave(request, response);
  } else if (action == "rate") {
    respData = await updateProfileRating(request, response);
  } else if (action == "madeIt") {
    respData = await updateProfileMadeIt(request, response);
  } else if (action == "delete") {
    respData = await updateProfileDelete(request, response);
  } else if (action == "signout") {

    console.log("signout");
    request.session.destroy();
    delete response.locals.theUser;
    respData = {};
  }

  let userProfile = request.session.currentProfile;
  if (userProfile == null || userProfile.length == 0) {
    request.emptyProfile = "Your profile is empty";
  }

  response.render(respData.view, {
    data: respData.data
  });
});

let showProfile = function(request, response) {

  let userProfile = request.session.currentProfile;
  if (userProfile == null || userProfile == 0) {
    request.emptyProfile = "Your profile is empty";
  } else {
    request.session.currentProfile = userProfile;
  }
  viewAddress = 'myItems';

  viewData = userProfile;

  profile = {
    view: viewAddress,
    data: viewData
  };
  return profile;
};

let updateProfile = function(request, response) {
  console.log("update profile function");
  let viewAddress = "";

  let viewItems = request.body.itemList;
  let itemCodeParam = request.body.itemCode;


  if (itemCodeParam != null || !itemCodeParam == "") {


    let userProfile = request.session.currentProfile;

    if (isItemInView(viewItems, itemCodeParam)) {
      console.log("item in view");

      userItem = isItemInProfile(userProfile, itemCodeParam);

      if (userItem != null) {
        console.log("item in profile");
        request.thisUserItem = userItem;


        viewAddress = "feedback";

        viewData = userItem;
        console.log("view Data :" + JSON.stringify(viewData));

        profile = {
          view: viewAddress,
          data: viewData
        };
        return profile;

      }
    }
  }
  return null;
}

let isItemInProfile = function(userProfile, itemCodeParam) {

  let itemCode = 0;
  let userItems = userProfile
  for (let i = 0; i < userItems.length; i++) {
    itemCode = userItems[i].item.code;
    if (itemCode == itemCodeParam) {
      return userItems[i];
    }
  }
  return false;
};

let updateProfileSave = async function(request, response) {
  let userProfile = request.session.currentProfile;


  let viewItems = request.body.itemList;
  let itemCodeParam = request.body.itemCode;

  if ((isItemInView(viewItems, itemCodeParam)) && (!isItemInProfile(userProfile, itemCodeParam))) {
    if (typeof itemCodeParam != 'undefined') {
      let userProfileObj = new UserProfile();

      await userProfileObj.addItem(request.session.theUser.email, itemCodeParam);

      let userItems = userProfileObj.getItems();
      let userItemsArr = await makeProfileItemsForView(userItems);

      userProfileObj.setItems(userItemsArr);
      request.session.currentProfile = userProfileObj.getItems();

    }
  }
  viewData = request.session.currentProfile;

  profile = {
    view: "myItems",
    data: viewData
  };

  return profile;
}

let updateProfileRating = async function(request, response) {
  let userProfile = request.session.currentProfile;


  let viewItems = request.body.itemList;
  let itemCodeParam = request.body.itemCode;

  if ((isItemInView(viewItems, itemCodeParam)) && (isItemInProfile(userProfile, itemCodeParam))) {
    let ratingParam = request.body.rating;
    if (typeof ratingParam != 'undefined') {
      if (ratingParam == "No") {
        ratingParam = 0;
      } else if (ratingParam == "Yes") {
        ratingParam = 1;
      }
      let userProfileObj = new UserProfile();
      userProfileObj.setItems(userProfile);
      let userItem = isItemInProfile(userProfile, itemCodeParam);
      if (userItem) {
        userItem.rating = ratingParam;
        await userProfileObj.updateItemRating(userItem, request.session.theUser.email);
        request.session.currentProfile = userProfileObj.getItems();
      }
    }
  }
  viewData = request.session.currentProfile;

  profile = {
    view: "myItems",
    data: viewData
  };
  console.log(profile);

  return profile;
}

let updateProfileMadeIt = async function(request, response) {
  let userProfile = request.session.currentProfile;


  let viewItems = request.body.itemList;
  let itemCodeParam = request.body.itemCode;

  if ((isItemInView(viewItems, itemCodeParam)) && (isItemInProfile(userProfile, itemCodeParam))) {
    let madeItParam = request.body.madeIt;
    if (typeof madeItParam != 'undefined') {
      if (madeItParam == "No") {
        madeItParam = 0;
      } else if (madeItParam == "Yes") {
        madeItParam = 1;
      }
      let userProfileObj = new UserProfile();
      userProfileObj.setItems(userProfile);
      let userItem = isItemInProfile(userProfile, itemCodeParam);
      userItem.madeIt = madeItParam;
      await userProfileObj.updateItemFlag(userItem, request.session.theUser.email);
      request.session.currentProfile = userProfileObj.getItems();
    }
  }
  viewData = request.session.currentProfile;

  profile = {
    view: "myItems",
    data: viewData
  };
  console.log(profile);

  return profile;
}

let isItemInView = function(viewItems, itemCode) {


  if (typeof viewItems == 'object') {
    for (let i = 0; i < viewItems.length; i++) {

      if (viewItems[i] == itemCode) {

        return true;
      }
    }
  } else if (typeof viewItems == 'string') {
    if (viewItems == itemCode) {

      return true;
    }
  }

  return false;
}

let updateProfileDelete = function(request, response) {
  console.log("in updateProfileDelete function");
  let userProfile = request.session.currentProfile;

  let viewItems = request.body.itemList;
  let itemCodeParam = request.body.itemCode;

  if ((isItemInView(viewItems, itemCodeParam)) && (isItemInProfile(userProfile, itemCodeParam))) {

    let userProfileObj = new UserProfile();
    userProfileObj.setItems(userProfile);
    let userItem = isItemInProfile(userProfile, itemCodeParam);
    if (userItem != null) {
      console.log("remove item");

      userProfileObj.removeItem(request.session.theUser.email, itemCodeParam);
      request.session.currentProfile = userProfileObj.getItems();
    }
  }
  viewData = request.session.currentProfile;


  profile = {
    view: "myItems",
    data: viewData
  };
  return profile;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
async function makeProfileItemsForView(userItems) {
  let userItemsArr = [];

  await asyncForEach(userItems, async (element) => {
    userItem = new UserItemObj();
    item = await ItemDB.getItem(element.item);
    userItem.setItem(item);
    userItem.setRating(element.rating);
    userItem.setMadeIt(element.madeIt);
    userItemsArr.push(userItem);
  });
  return userItemsArr;
}

module.exports = router;
