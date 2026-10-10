import mongoose from "mongoose";
const captonSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true
  },

  password:{
    type:String,
    required:true
  },
  isAvailable:{
    type:Boolean,
    default:false
  }
})


export const captonModel = mongoose.model("capton" , captonSchema);
