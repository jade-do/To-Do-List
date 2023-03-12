const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const date = require(__dirname + "/date.js");


const app = express();

app.use(express.static("public")); // folder used as static folder
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs'); // app uses EJS as its view engine

const uri = "mongodb+srv://thanhchaudo522:VKLs6CbXBBlOuIXw@cluster0.x2fbny8.mongodb.net/";
//const uri = "mongodb://127.0.0.1:27017/";
mongoose.connect(uri + "todoListDB", {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Need to input todo list item!"]
    }
    // finished: Boolean
});

const Item = mongoose.model("Item", itemsSchema);

const customListSchema = {
    name: String,
    items: [itemsSchema]
}

const CustomList = mongoose.model("CustomList", customListSchema);

const item1 = new Item({
    name: "Welcome to your ToDo List!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

var day = date.getDay();

app.get("/", function(req, res) {

    // var day = date.getDay(); // () : calling the function that is bound to the module date
    //var day = "Today";

    Item.find({})
        .then((foundItems) => {

            if (foundItems.length == 0) {
                Item.insertMany([item1, item2, item3])
                    .then((result) => {
                        return;
                    })
                    .catch((err) => {
                        console.log(err);
                    });   
                res.redirect("/");           
            } else {
                res.render("list", {listTitle: day , newListItems: foundItems});
            }
        })
        .catch((err) => {
            console.log(err);
        })

    
    
});


app.get("/:customListName", function(req, res) {
    
    const customListName = _.capitalize(req.params.customListName);

    if (customListName === "Daily" || customListName === "Today") {
        res.redirect("/"); 
    } else {
        CustomList.findOne({name: customListName})
        .then((foundList) => {
            if (! (foundList == null)) {
                res.render("list", {listTitle: customListName, newListItems: foundList.items});

            } else {
                const customList = new CustomList({
                    name: customListName,
                    items: defaultItems
                });
            
                customList.save();
                res.render("list", {listTitle: customListName, newListItems: customList.items});

            }
        }).
        catch((err) => {
            console.log(err);
        })
    }

})

    
app.post("/", function(req, res) {
    //var newItem = req.body.newItem;
    var listName = req.body.list;

    var itemName = req.body.newItem;
    var newItem = new Item({
        name: itemName
    })

    console.log(listName);

    if (listName === day) {

        newItem.save();
        res.redirect("/");

    } else {

        CustomList.findOne({name: listName})
        .then((foundList) => {
            if (! (foundList == null)) {
                console.log(foundList);
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + listName);
            }
        }).
        catch((err) => {
            console.log(err);
        })

    }
});

app.post("/search", function(req, res) {

    listName = _.capitalize(req.body.searchList);


    if (listName === "Daily" || listName === "Today" ) {
        res.redirect("/"); 
    } else {
        CustomList.findOne({name: listName})
        .then((foundList) => {
            if (! (foundList == null)) {
                res.render("list", {listTitle: listName, newListItems: foundList.items});

            } else {
                const newList = new CustomList({
                    name: listName,
                    items: defaultItems
                });
            
                newList.save();
                res.render("list", {listTitle: listName, newListItems: newList.items});

            }
        }).
        catch((err) => {
            console.log(err);
        })
    }
});


app.post("/delete", function(req, res){
    var checkedItemId = req.body.checkbox.trim();
    var listName = req.body.listName;

    if (listName === day) {
        Item.findByIdAndRemove(checkedItemId)
        .then((result) => {
            console.log("Removed item " + result);
            return;
        })
        .catch((err) => {
            console.log(err);
        })

        res.redirect("/");
    } else {
        CustomList.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
            .then((result) => {
                res.redirect("/" + listName);
                return;
            })
            .catch((err) => {
                console.log(err);
            })
    }


});


app.listen(process.env.PORT || 3000, function() {
    console.log("Server is up and running on port 3000");
});
