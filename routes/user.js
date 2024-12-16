const express=require("express");
const router=express.Router();
const passport=require("passport");
const ExpressError=require("../ExpressError");
const User=require("../models/user");
const {saveRedirectUrl}=require("../middleware.js");

router.get("/signup",(req,res)=>{
  res.render("user/signup.ejs");
});

router.post("/signup",async(req,res,next)=>{
  let {username,email,password}=req.body;
  try{
    let newUser=new User({username,email});
   let registeredUser= await User.register(newUser,password);
   req.login(registeredUser,(err)=>{
    if(err)
    {
      next(err);
    }
    req.flash("success","Successfully user added");
    res.redirect("/listings");
   })
  
  }
  catch(err)
  {
    req.flash("error","This username already exists.");
    res.redirect("/signup");
  }
});

  router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
  }); 

  router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login" , failureFlash: true} ), async(req,res,next)=>{
    
      req.flash("success","Welcome back to wonderlust!");
      let redirectUrl=res.locals.RedirectUrl || "/listings";
    console.log(redirectUrl);
    res.redirect(redirectUrl);
  })

  router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        next(err);
      }
      req.flash("success","You logged out successfully");
      res.redirect("/listings");
    })
  })
 

module.exports=router;