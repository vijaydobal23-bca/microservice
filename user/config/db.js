import mongoose from "mongoose";

export function connectDb(){
  mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Database connected");
  }).catch((err)=>{
    console.log("connection failled - >",err);
  })
}