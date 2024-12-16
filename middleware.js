const Listing=require("./models/listing");
module.exports.isloggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must logged in to do this");
   return res.redirect("/login");
  }

next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.RedirectUrl=req.session.redirectUrl;
 }
  next();  
};

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if(res.locals.CurrUser && !res.locals.CurrUser._id.equals(listing.owner._id)){
    req.flash("error","You are not the owner of listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
}