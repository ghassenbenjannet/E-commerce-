var express = require('express');
var path =require ('path');
var mongoose=require('mongoose');
var config = require('./config/database');
var bodyParser=require('body-parser');
var session = require('express-session');
var  expressValidator=require('express-validator');

// connect to db
mongoose.connect(config.database);
var  db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log('connected to MongoDB');
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

// Body Parser 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
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

app.use('/admin/pages',adminPages);
app.use('/',pages);

//start the server
port=3000;
app.listen(port,function(){
    console.log('server satrted on port '+ port);
});

//this is a test to see if github works 
<<<<<<< HEAD
//yes it work <3
//heyy !
=======
// rana t3ebnaaa :'(
>>>>>>> 0197cc8a5e382a47207cca8119330d1445ae4950
