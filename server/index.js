const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); // Move this to the top

const { dbConnect } = require("./config/db");
const authRouter = require("./routes/auth")
const userRouter = require("./routes/users"); // Import the new user routes
const Answer = require("./models/Answer"); // Import Answer model to ensure it's registered
const questionRouter = require('./routes/questions');
const uploadRouter = require('./routes/uploadRoutes'); // Import the new upload routes

const port = process.env.PORT || 3000; // Provide a default port
const app = express();
app.use(express.json());

app.use(cors({
  origin : "*"
}))

app.use("/api/v1", authRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/users', userRouter); // Mount the user routes
app.use('/api/v1/upload', uploadRouter); // Mount the upload routes

app.listen(port,()=>{
  dbConnect()
  console.log(`server on  : ${port}`)
})