const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


const app = express();

app.use(express.static("public")); // folder used as static folder
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs'); // app uses EJS as its view engine


const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = ["Write report"];
const schoolItems = ["Write essay"];
const vacationItems = ["Book flight ticket", "Pack luggage", "Book hotel room"];


app.get("/", function(req, res) {

    var day = date.getDay(); // () : calling the function that is bound to the module date

    res.render("list",{listTitle: day , newListItems: items});
    
});


app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work", newListItems: workItems});
});

app.get("/school", function(req, res) {
    res.render("list", {listTitle: "School", newListItems: schoolItems});
});

app.get("/vacation", function(req, res) {
    res.render("list", {listTitle: "Vacation", newListItems: vacationItems});
});

app.get("/about", function(req, res) {
    res.render("about");
})

app.post("/", function(req, res) {
    var newItem = req.body.newItem;

    console.log(req.body);


    if (req.body.button === "Work") {

        workItems.push(newItem);
        res.redirect("/work");

    } else if (req.body.button === "School") {

        schoolItems.push(newItem);
        res.redirect("/school");

    } else if (req.body.button === "Vacation") {

        vacationItems.push(newItem);
        res.redirect("/vacation");

    } else {
        items.push(newItem);
        res.redirect("/");
    }

});

app.post("/work", function(req, res) {
    var newItem = req.body.newItem;

    workItems.push(newItem);

    res.redirect("/work");
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Server is up and running on port 3000");
});
