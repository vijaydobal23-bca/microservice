import express from "express";
import { config } from "dotenv";
config();
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(userRoutes);

app.get("/" ,(req ,res)=>{
  res.send("Hello world");
})


export default app;