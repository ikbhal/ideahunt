var http = require('http'),
	express = require('express'),
	app = express();

// Loads configuration files
var nconf = require('nconf');
nconf.argv()
       .env()
       .file({ file: 'config/twitter_oauth.json' });


var passport = require('passport');
var TwitterStrategy = require('passport-twitter');

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://toprecur.clouadpp.net/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

var path = require('path');
var express = require('express');
var logger = require('morgan');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var session = require('express-session');
var errorHandler = require('errorhandler');
var multer = require('multer');
var bodyParser = require('body-parser');


//var mongoose = require('mongoose');
//    "mongodb": "^1.4.26",
//    "mongoose": "^3.8.21",

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;



app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(session({resave:true, saveUninitialized:true, secret: 'uwotm8'}));

app.use(passport.initialize());
app.use(passport.session());

app.set('port', (process.env.PORT || 80));
app.use(express.static(path.join(__dirname , 'public')));
app.use(errorHandler({dumpExceptions:true, showStack:true}));


app.get('/', function(req, res){
	res.end("Hello World");
});

http.createServer(app).listen(app.get('port'),function(err){
	console.log("Started server");
});