const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing =require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(".");
      throw new ExpressError(400,errorMsg);
    }else{
      next();
    }
  };


//Index Route
router.get("/",wrapAsync(async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    }));
  
  //New Route
router.get("/new",isLoggedIn,(req,res) => {
      
      res.render("listings/new.ejs");
    });
  
  //Show Route
  router.get("/:id",wrapAsync(async(req,res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id).populate("reviews").populate("owner");
     if(!listing){
      req.flash("error", "Listing You requested for does not exist");
      res.redirect("/listings");
     }
     console.log(listing);
     res.render("listings/show.ejs",{listing});
  }));
  
  
  //Create Route
  router.post("/",isLoggedIn,validateListing,
  wrapAsync(async(req,res,next) => {
    
    //  if(!req.body.listing){
    //   throw new ExpressError(400,"send valid data for listing");
    //  }
    //  if(!newListing.title){
    //   throw new ExpressError(400,"Title Is Missing");
    //  }
    //  if(!newListing.description){
    //   throw new ExpressError(400,"Description Is Missing");
    //  }
    //  if(!newListing.location){
    //   throw new ExpressError(400,"location Is Missing");
    //  }
    //  if(!newListing.location){
    //   throw new ExpressError(400,"location Is Missing");
    //  } if(!newListing.country){
    //   throw new ExpressError(400,"country Is Missing");
    //  }
    // let {title,description,image,price,country,location} = req.body;
      let listing = req.body.listing;
      const newListing = new Listing(listing);
      newListing.owner = req.user._id;
      await newListing.save();
      req.flash("success", "New Listing Created!");
      res.redirect("/listings");
  })
  );
  
  //Edit Route
  router.get("/:id/edit",wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
  
    if(!listing){
      req.flash("error", "Listing You requested for does not exist");
      res.redirect("/listings");
     }
     
     res.render("listings/edit.ejs",{listing});
  }));
  //update Route
  router.put("/:id",isLoggedIn,validateListing,wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  }));
  
  //Delete Route
  router.delete("/:id", isLoggedIn, wrapAsync(async(req,res) => {
     let {id} = req.params;
     let deleteListing = await Listing.findByIdAndDelete(id);
     req.flash("success", "Listing Deleted!");
     res.redirect("/listings");
  }));

  module.exports = router;