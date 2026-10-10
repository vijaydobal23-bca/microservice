import { connectDb } from "./config/db.js";
import app from "./src/app.js";

connectDb();

app.listen(3000,()=>{
  console.log("user service is running on port 3000");
})