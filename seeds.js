var mongoose = require('mongoose');
var camp = require("./models/campgrounds");

var d="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

// var data = [
//     {
//         author:'Gaurav',
//         name:'Kashmir',
//         image:'https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4d1156d3e4dfafbc71a9f293939f3243&auto=format&fit=crop&w=700&q=60',
//         description:d
//     },
//     {
//         author:'Gaurav',
//         name:'Leh-Ladakh',
//         image:'https://images.unsplash.com/photo-1483381719261-6620dfa2d28a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b201f4cac49215d2be151bb4d5bc454f&auto=format&fit=crop&w=700&q=60',
//         description:d
//     },
//     {
//         author:'Gaurav',
//         name:'Ranthambore',
//         image:'https://images.unsplash.com/photo-1496425745709-5f9297566b46?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b084690f83c5e63fafd161f8bc729a1f&auto=format&fit=crop&w=700&q=60',
//         description:d
//     },
//     {
//         author:'Gaurav',
//         name:'Rann of Kuchh',
//         image:'https://images.unsplash.com/photo-1485343034225-9e5b5cb88c6b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a28fc68742556a682ecac876ab4b9c2c&auto=format&fit=crop&w=700&q=60',
//         description:d
//     }
//     ];

var comment = require('./models/comments');

function seedDB(){
    //emptying DB
    camp.remove({},function(err,camp){
    if(!err){
        console.log("DB Empty!");
    }
    });
    //recreating cgs
    
    // for(var i=0;i<data.length;i++){
    //     camp.create(data[i],function(err,camp){
    //         if(!err){
    //             console.log("Planted seed!");
    //             //adding comment
    //             comment.create({text:"Great place but no network.",author:'Rajan'},function(err,comment){
    //                 if(!err){
    //                     camp.comments.push(comment);
    //                     camp.save();
    //                     console.log("Comment made");
    //                 }
    //             })
    //         }
    //     });
    // }
}

module.exports = seedDB;