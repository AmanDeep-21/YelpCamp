var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")



// Campground Routes


// INDEX
router.get("/", function(req, res){    
    Campground.find({}, function(err, allcampgrounds){ //finds all campground
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allcampgrounds}); // passing the data to ejs
        }
    })

    
});
// CREATE
router.post("/", isLoggedIn, function(req, res){
    // we need to get data from form and add to campground and also redirect to campground page
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username:req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author}
    console.log(req.user);
    
    // Creating a campground and save it to a database
    Campground.create(newCampground, function(err, newground){
        if(err){
            console.log("An Error!");
            console.log(err);
        }else{
            console.log("New Ground");
            console.log(newground);     
        }
    })

    //and redirect to /campgrounds
    res.redirect("/campgrounds");

});
// NEW
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new")
    
})
// Show
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){ 
        // finds campground with specific ID and returns that specific campground, along with "comments"
        if(err){
            console.log(err);            
        }else{
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
    
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login")
    }
}


module.exports = router