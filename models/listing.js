const mongoose = require('mongoose');
const Review=require("./review");
// const  none=async(err,res)=>{
//   await mongoose.connect("mongodb://0.0.0.0:27017/wonderlust");

// }
// none().then(res=>{
//   console.log("Database connected");
// }).catch(err=>{
//   console.log(err);
// });
const listingSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
  },
  image:{
    url:String,
    filename:String
    
  },
  price:{
    type:Number, 
    required:true             
  },
  location:{
    type:String,
    required:true 
  },
  country:{
    type:String,
    required:true 
  },
  reviews:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review"
  }],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"  
  }
});
const listing=mongoose.model("listing",listingSchema);
module.exports=listing;