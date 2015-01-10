var http = require('http'),
	express = require('express'),
	app = express();
var mongoose = require('mongoose');

// Loads configuration files
var nconf = require('nconf');
nconf.argv()
       .env()
       .file({ file: 'config/twitter_oauth.json' });

var TWITTER_CONSUMER_KEY = nconf.get('consumerKey');
var TWITTER_CONSUMER_SECRET = nconf.get('consumerSecret');
var TWITTER_CALLBACK_URL = nconf.get('callbackURL');


var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Twitter profile is serialized
//   and deserialized.
/*
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
*/
// serialize and deserialize
passport.serializeUser(function(user, done){
	//done(null, user);
	console.log('serializeUser: ' + user._id);
	done(null, user._id);
});

passport.deserializeUser(function(id, done){
	//done(null, obj);
	User.findById(id, function(err, user){
		console.log(user);
		if(!err) done(null, user);
		else done(err, null);
	});
});


passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: TWITTER_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
  	/*
 // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Twitter profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Twitter account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }*/

  		User.findOne({oauthID: profile.id}, function(err,user){
				if(err) { console.log(err); done(err, null);};
				if(!err && user != null ){
					done(null, user);
				} else {
					var user = new User({
						oauthID: profile.id,
						name: profile.displayName,
						created: Date.now()
					});

					user.save(function(err, user){
						if(err){
							console.log(err);
							done(err, nul);
						}else{
							console.log('Saving user ...');
							done(null, user);
						}
					});
				}
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


//Mongoose
var MONGO_URI = 'mongodb://localhost/ideahunt';
var mongo = MONGO_URI;

mongoose.connect(mongo, function(err){
	if(err){
		console.log("Unable to connec to mongo due to err: " + err);
	} else {
		console.log('Connect to mongo successfully');
	}
});

var User = mongoose.model('User', 	{
	oauthID: Number,
	name: String,
	created: Date
});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
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


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

/*
app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});
*/
// Twitter oauth call back url.
app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("twitte authentication succesful");
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/error', function(req, res){
	console.log("Error occured");
	req.send("Error occured");
});

// ejs test 
app.get('/ejs', function(req, res){
	var user = {name: 'ikbha', oauthID : '112123344'};
	res.render('ejs', {"user": user});
});

app.get('/ping', function(req, res){
	res.end('pong');
});

//home page
app.get('/', function(req, res){
	console.log("route for / ");
	if(req.isAuthenticated()) {
		console.log("Authenticate  , default index.jade with extra user");
		User.findById(req.session.passport.user, function(err, user){
			if(err) {
				console.log(err);
			} else {
				console.log("user fetched is " + user);
				res.render('index', {user: user});
			}
		});
	}else {
		console.log("Authenticate not , default index.jade");
		res.render('index');
	}
});

http.createServer(app).listen(app.get('port'),function(err){
	console.log("Started server");
});