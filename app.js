var express = require('express');
var app = express();
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var localStratergy = require('passport-local');
var user = require("./models/user");
app.locals.moment = require('moment');

app.use(flash());

mongoose.connect(process.env.DATABASEURL);

var camp = require('./models/campgrounds');

var comment = require('./models/comments'); 

var methodOverride = require('method-override');

var seed = require('./seeds');

// seed();


app.set("view engine","ejs");

app.use(methodOverride('_method'));

var bodyparser = require('body-parser');

app.use(require('express-session')({
   secret:"grvdhwn",
   resave:false,
   saveUninitialized:false
}));


app.use(express.static(__dirname+"/public"));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(bodyparser.urlencoded({extended:true}));

 var campgrounds=[];


app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.get("/",function(req,res){
   res.render("landing"); 
});

app.get("/index",function(req,res){
    camp.find({},function(err,camp){
       if(err){
           console.log(err);
       } 
       else{
           res.render("index",{cgs:camp,currentUser:req.user});
       }
    });
});

app.post("/index",isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.url;
    var description=req.body.description;
    var p=req.body.price;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    camp.create({author:author,price:p,name:name,image:image,description:description},function(err,camp){
       if(err){
           console.log("ERROR!");
       } 
       else{
        //   console.log(camp);
       }
    });
    res.redirect("/index");
});

app.get("/index/new",isLoggedIn,function(req,res){
   res.render("new.ejs",{n:req.user}); 
});

app.get("/index/:id",function(req,res){
    camp.findById(req.params.id).populate("comments").exec(function(err,camp){
       if(!err){
        //   console.log(camp);
           res.render("show",{c:camp});
       } 
    });
});

app.get("/index/:id/edit",checkCampgroundOwnership,function(req,res){
    
         camp.findById(req.params.id,function(err,camp){
             if(!err){
                res.render("edit",{c:camp});    
             }
         });   
});

app.put("/index/:id/edit",checkCampgroundOwnership,function(req,res){
   camp.findByIdAndUpdate(req.params.id,{name:req.body.name,image:req.body.url,description:req.body.description},function(err,c){
       if(!err){
           req.flash("success","Succesfully Updated!");
           res.redirect("/index/"+c._id);
       }
       else{
           req.flash("error","Campground not found!");
           res.redirect("/index");
       }
   });
});

app.get("/index/:id/delete",checkCampgroundOwnership,function(req,res){
   camp.findByIdAndDelete(req.params.id,function(err,camp){
       if(!err){
           req.flash("success","Succesfully Deleted!");
           res.redirect('/index');
       }
       else{
           res.redirect("/index");
       }
   }); 
});

app.get("/index/:id/comments/new",isLoggedIn,function(req,res){
    camp.findById(req.params.id,function(err,camp){
        if(!err){
            res.render("newcomment.ejs",{c:camp});
        }
    });
});

app.post("/index/:id/comments",isLoggedIn,function(req,res){
   var c=req.body.text;
  camp.findById(req.params.id,function(err,camp){
      if(!err){
          var a={
              id:req.user._id,
              username:req.user.username
          }
          comment.create({author:a,text:c},function(err,comment){
              if(!err){
                  camp.comments.push(comment);
                  camp.save();
                  req.flash("success","Succesfully added Comment!");
                  res.redirect("/index/"+camp._id);
              } 
              else{
                  req.flash("error","Sorry , Could'nt post your comment.");
                  res.redirect("/index/"+camp._id);
              }
          });
      }
      else{
          res.redirect("/index");
      }
  });
});

app.get("/register",function(req,res){
   res.render("register"); 
});

app.post("/register",function(req,res){
   user.register(new user({username:req.body.username}),req.body.password,function(err,user){
       if(!err){
           passport.authenticate("local")(req,res,function(){
               req.flash("success","Welcome , "+req.body.username);
               res.redirect("/index");
           });
       }
       else{
           req.flash("error",err.message);
            return res.render("register"); 
       }
   });
});

app.get("/login",function(req,res){
   res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/index",
    failureRedirect:"/login"
}),function(req,res){
});

app.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/index");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First");
    res.redirect("/login");
}

function checkCampgroundOwnership(req,res,next){
     if(req.isAuthenticated()){
         camp.findById(req.params.id,function(err,camp){
            if(err || !camp){
               req.flash("error","Camp Not Found!");
                res.redirect("/"); 
            }
            else{
                if(camp.author.id.equals(req.user._id)){
                next();
                }
               else{
                    req.flash("error","You are not permitted to do that.");
                    res.redirect("back");
                }
            }
         }); 
    }
    else{
        req.flash("error","You need to be logged in to do that.");
        res.redirect("/login");
    }
}

app.get("/index/:id/comments/:cid/edit",checkCommentOwnership,function(req,res){
   camp.findById(req.params.id,function(err,camp){
      if(!err){
          comment.findById(req.params.cid,function(err,com){
              if(!err){
                res.render("editcomment",{c:camp,comment:com});      
              }
              else{
                  res.redirect("back");
              }
          });
      }
      else{
          console.log(err.message);
          req.flash("error","Unauthorized access Attemp!");
          res.redirect("/index/"+req.params.id);
      }
   });
});

app.put("/index/:id/comments/:cid",function(req,res){
    var a={
        id:req.user._id,
        username:req.body.author
    }
   comment.findByIdAndUpdate(req.params.cid,{author:a,text:req.body.text},function(err,c){
       if(!err){
           req.flash("success","Comment Updated!");
           res.redirect("/index/"+req.params.id);
       }
       else{
           res.redirect("/index/"+req.params.id);
       }
   });
});

app.get("/index/:id/comments/:cid/delete",checkCommentOwnership,function(req,res){
   comment.findByIdAndDelete(req.params.cid,function(err,c){
       if(!err){
        req.flash("success","Succesfully Deleted Comment!");
        res.redirect("/index/"+req.params.id);   
       }
   }); 
});

function checkCommentOwnership(req,res,next){
     if(req.isAuthenticated()){
         comment.findById(req.params.cid,function(err,comment){
            if(!err){
                if(comment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You are not permitted to do that.");
                    res.redirect("back");
                }
            }
            else{
                req.flash("error","Comment Not Found!");
                res.redirect("/");
            }
         }); 
    }
    else{
        req.flash("error","You need to be logged in to do that.");
        res.redirect("back");
    }
}

app.listen(process.env.PORT,process.env.IP,function(){
 console.log("YelpCamp Server Started.");   
});
