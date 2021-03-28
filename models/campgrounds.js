var mongoose = require('mongoose');

var campSchema = new mongoose.Schema({
    name:String,
    price:String,
    image:String,
    description:String,
    author:{
        id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
        },
        username:String
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comments"
        }],
});

module.exports = mongoose.model("camps",campSchema);