var express = require('express');
var router = express.Router();
var ItemDB = require('../Models/itemDB');
let UserItemDB = require('../Models/UserItemDB');

var mongoose = require('mongoose');



var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/assignment4', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log('connection succesful');
});




var itemArray;

router.get("/*", async function(request, response, next) {

  let Landscape = await ItemDB.getItems("Landscape");
  let Sports = await ItemDB.getItems("Sports");
  itemArray = [{
    categoryName: "Landscape:",
    items: Landscape
  }, {
    categoryName: "Sports:",
    items: Sports
  }];

  console.log("items list length: " + itemArray.length);


  console.log("checking for session data");
  let sessionProfile = request.session.currentProfile;

  if (typeof sessionProfile != 'undefined') {

    response.locals.theUser = request.session.theUser;
  }
  next();
});

router.get('/', function(request, response, next) {

  response.render("index");
});

router.get('/categories', async function(req, res) {

  var viewData = await catalogValidation(req, res);
  console.log("view data from catalogvalidation: " + viewData);
  console.log("items list: " + viewData.view);

  console.log("in categories: " + JSON.stringify(viewData.data));

  res.render(viewData.view, {
    data: viewData.data
  });
});

router.get('/categories/:categoryName', function(req, res) {
  var categoryName = req.params.categoryName;

  var viewData = catalogValidation(req, res);

  res.render(viewData.address, viewData.data);
})
router.get('/categories/item/:itemCode', async function(req, res) {

  var viewData = await catalogValidation(req, res);
  console.log("in GET an item: " + JSON.stringify(viewData.data));

  res.render(viewData.view, {
    data: viewData.data
  });
});
router.get('/categories*', function(req, res) {

  var viewData = catalogValidation(req, res);
  viewAddress = 'catalog';
});

var catalogValidation = async function(req, res) {

  var viewAddress = 'catalog';
  var viewData = itemArray;


  if (req.params.categoryName != null && req.params.categoryName != "") {

    viewAddress = 'catalog';

    viewData = itemArray;

    catalog = {
      address: viewAddress,
      data: viewData
    };
    return catalog;


  } else if (req.params.itemCode != null && req.params.itemCode != "") {

    console.log("req.params.itemCode: " + req.params.itemCode);
    viewAddress = 'item';
    viewData = await ItemDB.getItem(req.params.itemCode);
    let itemRating = await UserItemDB.selectItemsForAvg(req.params.itemCode);
    let rating = await getAvg(itemRating);
    let ratingImg = "0-star-rating.png";
    if (rating >= 1 && rating < 2) {
      ratingImg = "1-star-rating.png";
    } else if (rating >= 2 && rating < 3) {
      ratingImg = "2-star-rating.png";
    } else if (rating >= 3 && rating < 4) {
      ratingImg = "3-star-rating.png";
    } else if (rating >= 4 && rating < 5) {
      ratingImg = "4-star-rating.png";
    } else if (rating >= 5) {
      ratingImg = "5-star-rating.png";
    }

    viewData.rating = ratingImg;
    viewData.inProfile = isProfileItem(req);


    catalog = {
      view: viewAddress,
      data: viewData
    };

    return catalog;

  } else {


    catalog = {
      view: viewAddress,
      data: itemArray
    };
    return catalog;
  }
};

async function getAvg(arr) {
  let total = 0;
  arr.forEach(function(el) {
    total = total + el.rating;
  })
  return total / arr.length;

};

function isProfileItem(req) {
  let userProfile = req.session.currentProfile;
  if (userProfile) {
    for (let i = 0; i < userProfile.length; i++) {
      itemCode = userProfile[i].item.code;
      if (itemCode == req.params.itemCode) {
        return true;
      }
    }
    return false;
  };
}
// for contact and about views
router.get('/contact', function (req, res) {
    // render contact view
    viewAddress = 'contact.ejs';
    res.render(viewAddress);
});

router.get('/about', function (req, res) {
    //render about view
    viewAddress = 'about.ejs';
    res.render(viewAddress);
});
module.exports = router;
