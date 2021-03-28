var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
   text:String,
   author:{
      id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"comments"
   },
   username:String
   }
});

module.exports = mongoose.model("comments",commentSchema); 