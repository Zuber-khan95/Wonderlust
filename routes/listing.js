const express=require("express");
const router=express.Router();


const Listing=require("../models/listing.js");
const {listingSchema}=require("../Validation.js");
const ExpressError=require("../ExpressError");
const {isloggedIn,isOwner}=require("../middleware.js");
// const { saveRedirectUrl }=require("../middleware.js");
const multer=require('multer');

const { cloudinary,storage }=require("../cloudConfig");
const upload=multer({ storage });


// index route
router.get("/", async(req,res,next)=>
{
  try{
    const allListing=await Listing.find({});
    if(!allListing){
      next(err);
    }
    else{
      res.render("listing/index.ejs",{allListing});
    }
     }
  catch(err){
    next(err);
  }
});

//create new route
router.get("/new",isloggedIn,(req,res,next)=>{
 
    res.render("listing/new.ejs"); 
  });
// show route
router.get("/:id",async(req,res,next)=>{
let {id}=req.params;
try{
  const listing=await Listing.findById(id)
  .populate({path: "reviews",
  populate:{path: "author"},
})
.populate("owner");
  if(!listing){
    req.flash("error","Sorry this does not exist anymore");
  }
  else{
    res.render("listing/show.ejs",{listing});
  }
}
catch(err){
  next(err);
}
});

//create new listing
router.post("/",isloggedIn,upload.single("image"),async(req,res,next)=>{
  try{

     const data=await listingSchema.validateAsync(req.body);
    if(!data){
      next(err);
    }
    else
    {
    data.owner=req.user._id;
    let url=req.file.path;
    let filename=req.file.filename;
    data.image={url,filename};
   

        const user1=await new Listing(data);
        await user1.save();
        req.flash("success","New listing added successfully.")
         res.redirect("/listings");
      }
   
  }
  catch(err){
    if(err.isJoi===true){
      err.status=422;
    }
    next(err);
  }
});

//edit route
router.get("/:id/edit",isloggedIn,isOwner,async(req,res,next)=>
{
  try
  {
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","Sorry this does not exist anymore so you can not edit");
    }
    else{
      res.render("listing/edit.ejs",{listing});
    }
   
  }
     
  catch(err){
    next(err);
  }
});

//update/patch route
router.patch("/:id",isloggedIn,upload.single("image"),isOwner,async(req,res,next)=>{
let {id}=req.params;
let updateData=req.body;
try{
  let listing=await Listing.findByIdAndUpdate(id,updateData);
  if(req.file){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
      req.flash("success","Listing updated successfully");
      res.redirect("/listings");
}
catch(err){
  next(err);
}
});

//delete route
router.delete("/:id",isloggedIn,isOwner,async(req,res,next)=>{
  let {id}=req.params;
  try{
    const listing=await Listing.findByIdAndDelete(id);
    if(!listing){
      req.flash("error","Sorry you can not delete this listing because it does not exist");
      next();
    }
    else{
      req.flash("success","listing deleted successfully.");
      res.redirect("/listings");
    }
   }
  catch(err){
    next(err);
  }
});
module.exports=router;