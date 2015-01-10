var http = require('http'),
	express = require('express'),
	app = express();
var util = require('util');
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

  		console.log('**********User twitter profile: ' + util.inspect(profile));

  		User.findOne({oauthID: profile.id}, function(err,user){
				if(err) { console.log(err); done(err, null);}
				if(!err && user != null ){
					done(null, user);
				} else {

					 user = new User({
						oauthID: profile.id,
						id: profile.id,
						name: profile.displayName,
						headline: profile._json.description,
						avatar_url: profile.profile_image_url,
						link: '/'+profile.username,
						username: profile.username,
						is_maker: false,
						created: Date.now()
					});

					console.log('********Before svaing user: ' + user);
					user.save(function(err, user){
						if(err){
							console.log(err);
							done(err, null);
						}else{
							console.log('*********Saving user ...' + user );
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
//var multer = require('multer');
var bodyParser = require('body-parser');


//Mongoose
var MONGO_URI = 'mongodb://localhost/ideahunt';
var mongo = MONGO_URI;

mongoose.connect(mongo, function(err){
	if(err){
		console.log('Unable to connec to mongo due to err: ' + err);
	} else {
		console.log('Connect to mongo successfully');
	}
});

/*
var User = mongoose.model('User', 	{
	oauthID: Number,
	name: String,
	created: Date
});
*/
var User = mongoose.model('User', 	{
	oauthID: Number,
	id: String, //twitter id, 
	name: String,
	headline: String,
	avatar_url: String,
	link: String,
	username: String,
	is_maker: Boolean,
	created: Date
});


var Idea = mongoose.model('Idea', {
	name : String,
	tagline : String,
	url : String,
	shortened_link: String,
	author:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	comments: [ {
		body : String,
		by : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		date : Date
	}],
	votes : [{
		by:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		date: Date
	}]
});

//helper embedded documents only, dont save directly there is no  use.
/*
var Comment = mongoose.model('Comment', {
	body : String,
	by : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	date : Date
});

var Vote = mongoose.model('Vote', {
	by:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	date: Date
});
*/
/**
Reference:
'url':'http://app-stop.appspot.com/',
      'name':'AppStop',
      'tagline':'Turn your App Store listing into a landing page',
      'comment_count':34,
      'slug':'appstop',
      'vote_count':514,
      'shortened_link':'8f27df5e13',
      'is_maker_inside':true,
      'author':{  
        'id':9445,
        'name':'Erik Finman',
        'headline':'CEO & Founder, Botangle',
        'avatar_url':'//aws.producthunt.com/profile_image/72238/1416425489-cQDJmWIP80@2X.jpeg',
        'link':'/erikfinman',
        'username':'erikfinman',
        'is_maker':true
      },
*/
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

/*
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
*/
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
    console.log('twitte authentication succesful');
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/error', function(req, res){
	console.log('Error occured');
	res.send('Error occured');
});

// ejs test 
app.get('/ejs', function(req, res){
	var user = {name: 'ikbha', oauthID : '112123344'};
	res.render('ejs', {'user': user});
});

app.get('/ping', function(req, res){
	res.end('pong');
});

// API
// Get all ideas
app.get('/ideas', function(req, res){
	console.log('Inside get /ideas -> get ideas');

	Idea.find()
	.populate('auhtor')
	.populate('comments')
	.populate('votes')
	.exec(function(err, ideas){
		var response = {'status': 'fail'};
		if(err) {
			console.log('Unable to get ideas due to error ' + util.inspect(err));
			response.err = err;
		} else { //Success 
			console.log('ideas  fetched are ' + ideas);

			response.status = 'success';
			response.data = ideas;
		}
		
		// Send response
		res.send(response);
	});

});

// Add idea
app.post('/ideas', function(req, res){
	console.log('Handling post /ideas ->Adding idea');

	// Get data
	var ideaInput = req.body;

	// Get user
	if(req.isAuthenticated()) {
		console.log('idea post  , default index.jade with extra user');
		User.findById(req.session.passport.user, function(err, user){
			if(err) {
				console.log(err);
			} else {
				console.log('user fetched is ' + user);

				// Create idea object
				var idea = new Idea();
				idea.name = ideaInput.name;
				idea.tagline = ideaInput.tagline;
				idea.url = ideaInput.url;
				idea.shortened_link = ideaInput.url;// TODO we will generate later shorten url concept
				idea.author = user;
				

				// Save Idea
				idea.save(function(err, idea){
					var response = {'status': 'fail'};
					if(err){
						console.log(err);
						response.err = err;
					}else{
						console.log('*********Saved idea ...' + idea );
						response.status = 'success';
						response.data = idea;
					}

					// Send response;
					res.send(response);

				});
			}
		});
	}else {
		console.log('Authenticate not , default error response');
		// Send response
		res.send({'status': 'fail', 'description' :'Please login to add idea'});
	}


});

//Vote
app.post('/ideas/:ideaId/vote', function(req, res){
	var ideaId = req.param('ideaId');
	console.log('Inside post vote for ideaId : ' + ideaId);

	var userId = req.body;
	console.log('userId:' + userId);
	// Check reques is authenticate or not
	if(userId && userId != null) {
		console.log('Authenticate  , default index.jade with extra user');
		var response = {'status' : 'fail'};

		// Retrieve user by session.
		User.findById(req.session.passport.user, function(err, user){
			if(err) {
				console.log(err);
				response.err = err;
				// send response fail
				res.send(response);
			} else {
				console.log('user fetched is ' + user);
				// Retrieve idea by path paremeter
				var idea = Idea.findById(ideaId)
				.populate('votes')
				.exec(ideaId, function(err, idea){
					if(err){ //fail
						console.log('Unable to find idea due to error : ' + err);
						response.err = err;
						// send response fail
						res.send(response);
					} else { //success
						// Check idea votes , if it already have user voted or not
						var voted = false;
						for(var i=0;i<idea.votes.length;i++){
							if(idea.votes[i]._id == user._id){
								voted = true;
								break;
							}
						}

						// user already voted, so  remove it
						if(voted){
							console.log("Already voted, so remove it");
							idea.votes[i].splice(i,1);
						}else { // does not voted, so add it
							console.log("idea was not voted, so adding user");
							idea.votes.push(user);
						}
						// Save idea
						idea.save(function(err, idea){
							if(err){
								console.log('Unable to save idea due to err' + util.inspect(err));
								response.err = err;
							}else {
								//success response
								response.data = idea;
								response.status = 'success';
							}
							//Send response
							res.send(response);
						});	
					}
					// Send response
					res.send(response);
				}); // end of idea retrieval				
			} // end of user retrieval else
	 	}); // end of user retrieval call
	}else { //not authenticate -> so fail
		console.log('Authenticate not , default index.jade');
		// Send fail response		
		var response = {'status' : 'fail', description : 'To vote you need to login'};
		res.send(response);
	}
});
// END OF API

//home page
app.get('/', function(req, res){
	console.log('route for / ');
	if(req.isAuthenticated()) {
		console.log('Authenticate  , default index.jade with extra user');
		User.findById(req.session.passport.user, function(err, user){
			if(err) {
				console.log(err);
			} else {
				console.log('user fetched is ' + user);
				res.render('index', {user: user});
			}
		});
	}else {
		console.log('Authenticate not , default index.jade');
		res.render('index');
	}
});

http.createServer(app).listen(app.get('port'),function(err){
	if(err){
		console.log('Unable to start server due to error: ' + util.inspect(err));
	}else {
		console.log('Started server');
	}
});