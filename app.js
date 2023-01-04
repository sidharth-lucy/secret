require('dotenv').config()

const express = require('express');
const bodyParser= require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
const md5= require('md5');


const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine' , 'ejs');
app.use(express.static('public'));



//////////////////// DataBase ///////////////////////

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
  username:{
    type: String ,
    required:true
  },
  password: {
    type:String,
    required:true
  }
});


// userSchema.plugin(encrypt , {secret:process.env.SECRET_KEY , encryptedFields:['password']});

const User = mongoose.model('User' , userSchema);


//////////////////// DataBase ///////////////////////



app.get('/' , function(req,res){
  res.render('home');
});

app.get('/login' , function(req,res){
  res.render('login');
});

app.post('/login' , function(req,res){
  const username = req.body.username;
  const password = md5(req.body.password);
  // console.log(req.body);
  User.findOne({username:username} , function(err,foundUser){
    // console.log(foundUser);
    if(err){
      res.redirect('/login');
    }
    else{
      if (foundUser && foundUser.password===password){
        res.render('secret');
      }
      else{
        res.redirect('/login');
      }
    }
  });

});





app.get('/register' , function(req,res){
  res.render('register');
});

app.post('/register' , function(req,res){
  const username = req.body.username;
  const password = md5(req.body.password);

  const newUser = User({username:username , password:password});

  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render('secret');
    }
  });

});





app.listen(3000, function(){
  console.log('Server is running on port 3000');
})
