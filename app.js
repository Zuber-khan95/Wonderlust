require('dotenv').config();

const express=require("express");
const app=express();
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const {saveredirectUrl}=require("./middleware.js");

const mongoose = require('mongoose');
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended:true}));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
const ExpressError=require("./ExpressError.js");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");

const listingRouter=require("./routes/listing");
const reviewRouter=require("./routes/review");
const userRouter=require("./routes/user"); 

const User=require("./models/user");

app.use((req,res,next,err)=>{
  let {status=500,message="some error"}=err;
  res.status(status).send(message);
})
const dbUrl=process.env.ATLASDB_URL;
const  none=async(err,res)=>{
  await mongoose.connect(dbUrl);

}
none().then(res=>{
  console.log("Database connected");
}).catch(err=>{
  console.log(err);
});

const session=require("express-session");
const MongoStore=require("connect-mongo");

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600
})

 let options={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+3*24*60*60*1000,
    maxAge:3*24*60*60*1000,
    httponly:true
  }
 };

 const flash=require("connect-flash");
const cookie=require("cookie-parser");
app.use(cookie());

let port= 3000;
app.listen(port,()=>{
console.log("App is listening the port:",port);
});
app.get("/",(req,res)=>
{
  res.send("I am the root");
});

app.use(session(options));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport .use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.successMsg=req.flash("success");
  res.locals.errorMsg=req.flash("error");
  res.locals.CurrUser=req.user;
  next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);

app.get("*",(req,res,next)=>{
  res.send("Page not found");
})

