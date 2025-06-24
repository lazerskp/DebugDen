const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : [true,"name is required"],
    trim : true
  },
  email : {
    type : String,
    required : [true,"email is required"],
    trim : true
  },

   password : {
    type : String,
    required : [true,"password is required"],
    trim : true,
    select : false

  },

})
module.exports = mongoose.model("User", userSchema);