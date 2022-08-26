if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const fs = require('fs');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const stripe = require('stripe')(stripeSecretKey)
// const popup = require('popups');
const alert = require('alert');



const app = express();



app.use(express.static("public"));
app.set('view engine' , 'ejs');
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(session({
  secret: "Our little secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB" , {useNewUrlParser : true , useUnifiedTopology: true});
// mongoose.set('useCreateIndex', true);

// mongoose.connect("mongodb://localhost:27018/feedbackDB" , {useNewUrlParser : true , useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
    username : String,
    name : String ,
    password : String,
    role : String,
    address : String ,
    landmark : String ,
    phonenumber : Number,
    product : String ,
    custname : String,
    email1 : String,
    feedback : String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User" , userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/" ,function(req,res){
    res.render("index");
})


app.get("/product" , function(req,res){

    fs.readFile('items.json', function(error, data) {
        if (error) {
          res.status(500).end()
        } else {
          if(req.isAuthenticated()){
              res.render("product.ejs", {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
              });
            } else {
              res.redirect("/login");
            }
        }
      })
})



app.get("/productdetails" , function(req , res){
    res.render("cpvcplumbing");
})

app.get("/cpvcplumbing" , function(req,res){
    res.render("cpvcplumbing");
})

app.get("/upvcplumbing" , function(req,res){
    res.render("upvcplumbing");
})

app.get("/swrplumbing" , function(req,res){
    res.render("swrplumbing");
})

app.get("/pvcplumbing" , function(req,res){
    res.render("pvcplumbing");
})

app.get("/service" , function(req,res){
    res.render("service");
})

app.get("/agriculture" , function(req,res){
    res.render("agriculture");
})

app.get("/industrial" , function(req,res){
    res.render("industrial");
})

app.get("/building" , function(req,res){
    res.render("building");
})

app.get("/login" ,function(req,res){
    res.render("login");
})

app.get("/register" ,function(req,res){
    res.render("register");
})

app.get("/about" , function(req,res){
    res.render("about");
})



app.post("/register" , function(req ,res){

    User.register({username : req.body.username , name:req.body.name , role: req.body.role , address:req.body.address , landmark:req.body.landmark , phonenumber:req.body.phonenumber} , req.body.password , function(err , user){
      if(err){
        console.log(err);
        res.redirect("/register");
      }else{
        passport.authenticate("local")(req,res,function(){
          res.redirect("/product");
        });
      }
    })
})

// app.post("/" , function(req,res){
//     const newUser = new User({
//         email1: req.body.email1,
//         custname : req.body.custname ,
//         feedback : req.body.feedback
//     });
//     newUser.save();
// })

app.post("/login" , function(req,res){
  const user = new User({
    username : req.body.username,
    password : req.body.password
  });
  req.login(user , function(err){
    if(err){
      console.log(err);
      alert("wrong email or password");
    }else {
        passport.authenticate("local")(req,res,function(){
          res.redirect("/product");
        })
      }
  })
    // const username = req.body.email;
    // const password = req.body.password;
    // User.findOne({email: username} , function(err , foundUser){
    //     if(err){
    //         console.log(err);
    //         alert("wrong email or password");
    //         console.log("error");
    //     }else{
    //         if(foundUser){
    //             if(foundUser.password === password){
    //                 res.render("product")
    //             }
    //         }
    //     }
    // })
});

app.post('/purchase', function(req, res) {
    fs.readFile('items.json', function(error, data) {
      if (error) {
        res.status(500).end()
      } else {
          console.log("purchase");
        const itemsJson = JSON.parse(data)
        const itemsArray = itemsJson.cpvc.concat(itemsJson.upvc)
        let total = 0
        req.body.items.forEach(function(item) {
          const itemJson = itemsArray.find(function(i) {
            return i.id == item.id
          })
          total = total + itemJson.price * item.quantity * 100
        })

        stripe.charges.create({
          amount: total,
          source: req.body.stripeTokenId,
          currency: 'inr'
        }).then(function() {
          console.log('Charge Successful')
          res.json({ message: 'Successfully purchased items' })
        }).catch(function() {
          console.log('Charge Fail')
          res.status(500).end()
        })
      }
    })

    // const purchasedProd = req.body.producttitle.innerText;
    // // finds the userid
    // console.log(req.user.id);
    //
    // User.findById(req.user.id ,function(err ,foundUser){
    //   if(err){
    //     console.log(err);
    //   } else {
    //     if(foundUser){
    //       foundUser.product = purchasedProd;
    //       foundUser.save();
    //     }
    //   }
    // });
  })




app.listen(3000 , function(){
    console.log("server started at port 3000");
})
