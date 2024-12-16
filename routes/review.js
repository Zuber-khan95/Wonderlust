const express=require("express");
const router=express.Router({mergeParams:true});


const Review=require("../models/review.js");
const Listing=require("../models/listing");
const {reviewSchema}=require("../Validation.js");
const ExpressError=require("../ExpressError");
const {isloggedIn}=require("../middleware");

// add feedback for a post
router.post("/",isloggedIn,async(req,res,next)=>{
  let {id}=req.params;
    try
    {
     const data=await reviewSchema.validateAsync(req.body);
     let listing=await Listing.findById(id);
     let Review1=await new Review(req.body);
    
     Review1.author=req.user._id;
     Review1.save();
    
     listing.reviews.push(Review1);
     listing.save();
     req.flash("success"," Added review Successfully.")
     res.redirect(`/listings/${listing._id}`);
  }
    catch(err)
    {
      if(err.isjoi===true)
      { 
        err.status=422;
      }
      next(err);
    }
   
  });
//delete route for review
  router.delete("/:reviewId",async(req,res,next)=>{
    try
    {
      let {id,reviewId}=req.params;
      let review=await Review.findById(reviewId);
      let listing1=await Listing.findById(id);
      console.log(review.author._id);
      console.log(req.user._id);
      if(res.locals.CurrUser&& !review.author._id.equals(res.locals.CurrUser._id)){
req.flash("error","You are not the owner of this review");
return   res.redirect(`/listings/${listing1._id}`);  
      }
      let listing=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
      if(!listing){
        req.flash("error","Sorry you can not delete this review because it does not exist");
        next();
      }
        await Review.findByIdAndDelete(reviewId);
        req.flash("success"," delete review Successfully.")
        res.redirect(`/listings/${listing._id}`);  
    }
    catch(err){
      next(err);
    }
  
  });
  module.exports=router;