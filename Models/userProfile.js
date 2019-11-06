let UserItemDB = require('../Models/UserItemDB');

class UserProfile {
    constructor(userItems) {
        this.userItems = userItems;
    }

    //setting the constructor to the equalivent of the profile items
    setItems(profileItems) {
        this.userItems = profileItems;
    }

    async addItem(theUser, itemCode) {
        //adds an item to the list
        console.log("adding item to ");
        console.log(itemCode);

        await UserItemDB.addItem(theUser, itemCode);

        this.userItems = await UserItemDB.selectUserItems(theUser);
        console.log("here " + this.userItems);


    }

    //removes item from list
    removeItem(theUser, itemCode) {

        let index = -1;
        console.log("length before delete :" + this.userItems.length);
        console.log("userItems before delete :" + this.userItems);

        for (let i = 0; i < this.userItems.length; i++) {
            console.log(this.userItems[i]);
            if (this.userItems[i].item.code == itemCode) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            console.log("found item to delete")
            this.userItems.splice(index, 1);
             UserItemDB.remove(theUser, itemCode);
        }

        console.log("index " + index);
        console.log(this.userItems);
        console.log("length after delete :" + this.userItems.length);

    }
    //updates item within list
    async updateItemRating(userItem, theUser) {
        for (let i = 0; i < this.userItems.length; i++) {
            if (this.userItems[i].item.code == userItem.item.code) {
                this.userItems[i].rating = userItem.rating;
                await UserItemDB.updateItemRating(theUser, userItem.item.code, userItem.rating);
                console.log("rating updated");
                return;
            }
        }

    }
    //updates the madeIt variable in list
    async updateItemFlag(userItem, theUser) {

        for (let i = 0; i < this.userItems.length; i++) {

            if (this.userItems[i].item.code == userItem.item.code) {
                this.userItems[i].madeIt = userItem.madeIt;
                await UserItemDB.updateItemFlag(theUser, userItem.item.code, userItem.madeIt);
                return;
            }
        }
    }

    //get items function
    getItems() {
        return this.userItems;
    }

}

module.exports = UserProfile;
