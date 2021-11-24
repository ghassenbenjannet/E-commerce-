var express = require('express');
var path =require ('path');
var mongoose=require('mongoose');
var config = require('./config/database');
var bodyParser=require('body-parser');
var session = require('express-session');
var  expressValidator=require('express-validator');
var fileUpload = require('express-fileupload');

// connect to db
mongoose.connect(config.database);
var  db=mongoose.connection;
db.on('error',console.error.bind(console,'erreur de connexion Mongo:'));
db.once('open',function(){
    console.log('connecté MongoDataBase');
});
// init app
var app=express();

// View engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname,'public')));

//set global variable for errors
app.locals.errors=null;

// GET Page Model
var Page=require('./models/page');

//Get all pages
Page.find({}).sort({sorting:1}).exec(function (erreur,pages){
      if(erreur)
          console.log(erreur);
      else{
          app.locals.pages=pages;
      }
   });
   
   
   // GET catégorie Model
var Category=require('./models/category');

//Get all catégories
Category.find(function (msg,mines){
      if(msg)
          console.log(msg);
      else{
          app.locals.categories=mines;
      }
   });

//Express fileUpload middlrware video 9
app.use(fileUpload());


// Body Parser 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
  //cookie: { secure: true }
}));

//express validator
app.use(expressValidator({
    errorFormatter: function(param,msg,value){
        var namespace=param.split('.')
        , root =namespace.shift()
        , formParam=root;
        while (namespace.length){
            formParam+='['+ namespace.shift()+ ']';
        }
        return{
            param :formParam,
            msg:msg,
            value: value
            
        };
    },
    customValidators:{
        isImage : function(val,fnom){
            var ext=(path.extname(fnom)).toLowerCase();
            switch(ext){
                case '.jpg' : return '.jpg';
                case '.png' : return '.png';
                default : return false;
            }
        }
    }
}));

//express Messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//set routes
var pages=require('./routes/pages.js');
var adminPages=require('./routes/admin_pages.js');
var adminCategories=require('./routes/admin_categories.js');
var adminProducts=require('./routes/admin_products.js');


app.use('/admin/pages',adminPages);
app.use('/admin/categories',adminCategories);//zed le 
app.use('/admin/products',adminProducts);//zed le 
app.use('/',pages);

//start the server
port=3000;
app.listen(port,function(){
    console.log('server satrted on port '+ port);
});


