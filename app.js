require('dotenv').config()

const express = require('express');
const bodyParser= require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');  /// can be used to encrypt using a key
// const md5= require('md5');    /// used to hash our password better than encryption

// const bcrypt = require('bcrypt');  //used for hashing and salting
// const saltRounds = 10;


// now we are going to use express-session , passport , passport-local , passport-local-mongoose
// to hashing salting , maintaining session and authenting

const session = require('express-session');
const passport= require('passport');
const passportLocalMongoose= require('passport-local-mongoose');




const app = express();



app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine' , 'ejs');
app.use(express.static('public'));


app.use(session({
  secret:"this is my secret mind",
  resave:false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



//////////////////// DataBase ///////////////////////
mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

// const userSchema = new mongoose.Schema({
//   username:{
//     type: String ,
//     required:true
//   },
//   password: {
//     type:String,
//     required:true  // don't know adding this is throwing error
//   }
// });

const userSchema = new mongoose.Schema({
  username:{
    type: String ,
    required:true
  },
  password:String
});

userSchema.plugin(passportLocalMongoose);


const User = mongoose.model('User' , userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//////////////////// DataBase ///////////////////////



app.get('/' , function(req,res){
  res.render('home');
});

app.get('/secret' ,function(req,res){
  if(req.isAuthenticated()){
    res.render('secret');
  }
  else{
    res.redirect('/login');
  }
});


app.get('/login' , function(req,res){
  res.render('login');
});

app.post('/login' , function(req,res){

  const user = new User({
    username: req.body.username,
    password: req.body.username
  })

  req.login(user , function(err){
    if(err){
      console.log(err);
      res.redirect('/login');
    }
    else{
      passport.authenticate('local')(req , res , function(){
        res.redirect('/secret');
      });
    }
  });

});





app.get('/register' , function(req,res){
  res.render('register');
});

app.post('/register' , function(req,res){
  console.log(req.body.password);
  User.register({username:req.body.username} , req.body.password , function(err , user){
    if(err){
      console.log(err);
      res.redirect('/register');
    }
    else{
      passport.authenticate('local')(req,res ,function(){
        res.redirect('/secret');
      });
    }
  });

});


app.get('/logout' , function(req,res){
  req.logout(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.redirect('/');
    }
  });
});




app.listen(3000, function(){
  console.log('Server is running on port 3000');
})

















/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////



// require('dotenv').config()
//
// const express = require('express');
// const bodyParser= require('body-parser');
// const ejs = require('ejs');
// const mongoose = require('mongoose');
//// const encrypt = require('mongoose-encryption');  /// can be used to encrypt using a key
//// const md5= require('md5');    /// used to hash our password better than encryption

// const bcrypt = require('bcrypt');  //used for hashing and salting
// const saltRounds = 10;

//
// const app = express();
//
// app.use(bodyParser.urlencoded({extended:true}));
// app.set('view engine' , 'ejs');
// app.use(express.static('public'));
//


//////////////////// DataBase ///////////////////////
//
// mongoose.connect('mongodb://127.0.0.1:27017/userDB');
//
// const userSchema = new mongoose.Schema({
//   username:{
//     type: String ,
//     required:true
//   },
//   password: {
//     type:String,
//     required:true
//   }
// });
//
//
//
// const User = mongoose.model('User' , userSchema);
//
//
// //////////////////// DataBase ///////////////////////
//
//
//
// app.get('/' , function(req,res){
//   res.render('home');
// });
//
//
//
// app.get('/login' , function(req,res){
//   res.render('login');
// });
//
// app.post('/login' , function(req,res){
//   const username = req.body.username;
//   const password = req.body.password;
//   // console.log(req.body);
//   User.findOne({username:username} , function(err,foundUser){
//     // console.log(foundUser);
//     if(err || foundUser==null){
//       res.redirect('/login');
//     }
//     else{
//       bcrypt.compare(password, foundUser.password, function(err, result) {
//           // result == true
//           if (result===true){
//             res.render('secret');
//           }
//           else{
//             res.redirect('/login');
//           }
//       });
//     }
//   });
//
// });
//
//
//
//
//
// app.get('/register' , function(req,res){
//   res.render('register');
// });
//
// app.post('/register' , function(req,res){
//   const username = req.body.username;
//   const password = req.body.password;
//
//     bcrypt.genSalt(saltRounds, function(err, salt) {
//       bcrypt.hash(password, salt, function(err, hash) {
//           // Store hash in your password DB.
//           if(err){
//             console.log(err);
//           }
//           else {
//             const newUser = User({username:username , password:hash});
//
//             newUser.save(function(err){
//               if(err){
//                 console.log(err);
//               }
//               else{
//                 res.render('secret');
//               }
//             });
//           }
//       });
//   });
//
//
// });
//
//
//
//
//
// app.listen(3000, function(){
//   console.log('Server is running on port 3000');
// })
//
//
//
//
//
//
//
//









/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
