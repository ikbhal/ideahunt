var mongoose = require('mongoose');
var util = require('util');
var ObjectId = require('mongodb').ObjectID;
//Mongoose
var MONGO_URI = 'mongodb://localhost/ideahunt';
var mongo = MONGO_URI;

console.log("Connecting mongodb....");

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
	headline: String,
	avatar_url: String,
	link: String,
	username: String,
	is_maker: Boolean,
	created: Date
});

/*
  "author":{  
        "id":221,
        "name":"Evan Beard",
        "headline":"Co-Founder, A+",
        "avatar_url":"//aws.producthunt.com/profile_image/2619/1416412528-evanbeard80@2X.jpg",
        "link":"/evanbeard",
        "username":"evanbeard",
        "is_maker":false
      }
*/
var Comment = mongoose.model('Comment', {
	body : String,
	by : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	date : Date
});

var Vote = mongoose.model('Vote', {
	by:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	date: Date
});

/*
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

*/

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

var comment = new Comment({
	body: 'Check with venturesity whether they needed or not',
	by : ObjectId("54b115c393e4792c0d2b7dd6"),
	date : Date.now()
});

var comment2 = new Comment({
	body: 'We will work if its valid and if i like too',
	by : ObjectId("54b11607e33f7fb41b4688e2"),
	date : Date.now()
});

var comment3 = new Comment({
	body: 'Get paid user',
	by : ObjectId("54b11cd7e3d4b1e013ee2109"),
	date : Date.now()
});

var comments = [comment, comment2];


// 2 votes ikbhal , towheed
var vote1 = new Vote({
	by: ObjectId("54b115c393e4792c0d2b7dd6"),
	date : Date.now()
});

var vote2 = new Vote({
	by: ObjectId("54b11607e33f7fb41b4688e2"),
	date : Date.now()
});

var vote3 = new Vote({

	by: ObjectId("54b11cd7e3d4b1e013ee2109"),
	date : Date.now()	
});
var votes = [];
votes.push(vote1);votes.push(vote2);

/*
var pairProgrammingMatchAsService = new Idea({
	name : 'Pair Programming Match As Service',
	tagline : 'Find person to work on pair prorgramming, chat with him while working',
	url : 'http://pair-programming-match-as-service.com',
	shortened_link: 'ppmas',
	author: ObjectId("54b115c393e4792c0d2b7dd6"),
	comments: comments,
	votes: votes
});


console.log(util.inspect(pairProgrammingMatchAsService));
pairProgrammingMatchAsService.save(function(err, pp){
	if(err){
		console.log(err);
	}else{
		console.log('Saved ppmas ...');
	}
});

*/


/*
> db.ideas.find()
{ "_id" : ObjectId("54b11bccccb65e8008834c17"), "name" : "Pair Programming Match As Service", "tagline" : "Find person to work on pair prorgramming, chat with him while working", "url" : "http://pair-programming-match-as-service.com", "shortened_link" : "ppmas", "author" : ObjectId("54b115c393e4792c0d2b7dd6"), "votes" : [ { "_id" : ObjectId("54b11bccccb65e8008834c15"), "date" : ISODate("2015-01-10T12:32:12.947Z"), "by" : ObjectId("54b115c393e4792c0d2b7dd6") }, { "_id" : ObjectId("54b11bccccb65e8008834c16"), "date" : ISODate("2015-01-10T12:32:12.947Z"), "by" : ObjectId("54b11607e33f7fb41b4688e2") } ], "comments" : [ { "_id" : ObjectId("54b11bccccb65e8008834c13"), "date" : ISODate("2015-01-10T12:32:12.947Z"), "by" : ObjectId("54b115c393e4792c0d2b7dd6"), "body" : "Check with venturesity whether they needed or not" }, { "_id" : ObjectId("54b11bccccb65e8008834c14"), "date" : ISODate("2015-01-10T12:32:12.947Z"), "by" : ObjectId("54b11607e33f7fb41b4688e2"), "body" : "We will work if its valid and if i like too" } ], "__v" : 0 }
*/


var ppmas = Idea.findById('54b11bccccb65e8008834c17', function(err, ppmas){
	if(err) {
		console.log(err);
	} else {
		console.log("ppmas fetched is " + ppmas);


		/*
		console.log("Adding comment 3 " + util.inspect(comment3));

		ppmas.comments.push(comment3);
		console.log("ppmas after addign commnet" + ppmas);
	*/

		ppmas.votes.push(vote3);
		console.log("ppmas after adding vote3" + ppmas);

		console.log("Saving ppmas");

		ppmas.save(function(err, ppmas){
			if(err){
				console.log("Unable to save ppmas");
			}else {
				console.log("Succesfully saved ppmas is " + util.inspect(ppmas));
			}

		});

	}
});



/*
> db.users.find()
{ "_id" : ObjectId("54b115c393e4792c0d2b7dd6"), "oauthID" : 1, "name" : "ikbhal", "created" : ISODate("2015-01-10T12:06:27.629Z"), "__v" : 0 }
{ "_id" : ObjectId("54b11607e33f7fb41b4688e2"), "oauthID" : 2, "name" : "towheed", "created" : ISODate("2015-01-10T12:07:35.396Z"), "__v" : 0 }
{ "_id" : ObjectId("54b11cd7e3d4b1e013ee2109"), "oauthID" : 3, "name" : "Summu", "created" : ISODate("2015-01-10T12:36:39.865Z"), "__v" : 0 }
*/

// Create one user
/**
oauthID : '1', name: 'ikbhal', 
*/
/*
var user = new User({
	oauthID: '1',
	name: 'ikbhal',
	created: Date.now()
});
*/

/*
towheed
var user = new User({
	oauthID: '2',
	name: 'towheed',
	created: Date.now()
});
*/

/*
var user = new User({
	oauthID: '3',
	name: 'Summu',
	created: Date.now()
});
*/

/*
user.save(function(err, user){
	if(err){
		console.log(err);
	}else{
		console.log('Saved user ...');
	}
});
*/

/*
User.findById(req.session.passport.user, function(err, user){
			if(err) {
				console.log(err);
			} else {
				console.log("user fetched is " + user);
				res.render('index', {user: user});
			});



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


*/