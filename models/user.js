const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
// const  none=async(err,res)=>{
//   await mongoose.connect("mongodb://0.0.0.0:27017/wonderlust");

// }
// none().then(res=>{
//   console.log("Database connected");
// }).catch(err=>{
//   console.log(err);
// });
const userSchema= new mongoose.Schema({
  email:{
    type:String,
    required:true
  }
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);