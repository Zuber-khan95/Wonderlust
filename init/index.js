const mongoose=require("Mongoose");

const  none=async(err,res)=>{
  await mongoose.connect("mongodb://0.0.0.0:27017/wonderlust");

}
none().then(res=>{
  console.log("Database connected");
}).catch(err=>{
  console.log(err);
});
const intdata=require("./data.js");
const Listing=require("../models/listing.js");

async function one(err,res){
  await Listing.deleteMany({});
  await Listing.insertMany(intdata.data);
}
one().then(res=>{
  console.log(res);
}).catch(err=>{
  console.log(err);
});