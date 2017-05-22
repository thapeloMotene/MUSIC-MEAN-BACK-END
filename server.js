var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var morgran = require('morgan');
var flash = require('express-flash');
var passport = require('passport');

var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);


//initialize the server
var app = express();

//middlewares plugins
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(morgran('dev'));

app.use(flash());

app.use(session({
	resave: true,
	saveUninitialized: true,
	secret:'password',
	store: new MongoStore({url: 'mongodb://localhost:27017/spotify', autoReconnect: true})

}));

app.use(passport.initialize());
app.use(passport.session());


//routes
var userRoutes = require('./routes/user.route');
var playlist = require('./routes/playlist.route');

app.use(userRoutes);
app.use(playlist);

//connection to local database
mongoose.connect('mongodb://localhost:27017/spotify', (err)=>{
    if (err){
         console.log('connection to database failed');
    }else{
         console.log('connection to database established successfully');
    }
    
})












//run server on port 3000
app.listen(3000, ()=>{
    console.log('app running on port 3000');
});


