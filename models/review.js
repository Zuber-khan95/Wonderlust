const mongoose=require("mongoose");

// const  none=async(err,res)=>{
//   await mongoose.connect("mongodb://0.0.0.0:27017/wonderlust");

// }
// none().then(res=>{
//   console.log("Database connected");
// }).catch(err=>{
//   console.log(err);
// });

const reviewSchema=new mongoose.Schema({
rating:{
  type:Number,
  min:0,
  max:5
},
comment:{
  type:String,
  required:true
},
createdAt:{
  type:Date,
  default:Date.now()
},
author:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
}});
const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;

