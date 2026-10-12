import { connectDb } from "./config/db.js";
import app from "./src/app.js";

connectDb();

app.listen(3002,()=>{
  console.log("capton service is running on port 3002");
}) 
 