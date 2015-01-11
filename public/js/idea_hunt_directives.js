ideaHuntApp.directive('ideaDay', ['ideaService', function(ideaService){
	console.log("Inside ideaDay handler");

	function link(scope, element, attrs) {
		console.log("Inside ideaDay handler link handler");
		
		scope.page = attrs.page;
		scope.ideas = [];

		page = attrs.page;
		console.log("page number: " + page);

		ideaService.getIdeasByPageId(scope.page).
			success(function(data, status, headers, config){
				console.log("Got the response form getIdeaByPageId ");
				console.log(response);
				scope.ideas = data.data;
				console.log("updated scope.ideas to ");
				console.log(scope.ideas);
			}).
			error(function(err){
				console.log('Unable to getIdeaByPageId idea due to error');
				console.log(err);
			});
	}

	return {
		restrict: 'E',
		link: link,
		scope: {
			page: '='
		},
		templateUrl: 'idea_day_template.html'
	};
}]);

// Idea Day Date
ideaHuntApp.directive('ideaDayDate', function(){
	console.log("inside ideaDayDate directive");

	function link(scope, element, attrs) {
		console.log("Inside ideaDayDate handler link handler");

		var page = scope.page;

		var date = getDateForPage(page);

		scope.dayName = getDayName(date);

		scope.dateString = getDateString(date);
	}

	// Get current date, previous date, nth days ago based on page no 0, 1, n
	function getDateForPage(page){
		var date = new Date();
		date.setDate(date.getDate()-page);

		return date;
	}

	//January 10th, January 9th, December 27, December 31st, January 1st, January 2nd,January 3rd,
	function getDateString(date){
		var dayNo = date.getDate();
		var dayStr = '';

		// Get day string
		switch(dayNo){
			case 0:
				dayStr = '1st';
				break;
			case 1:
				dayStr = '2nd';
				break;
			case 2:
				dayStr = '3rd';
				break;
			default:
				dayStr = dayNo+'th';
				break;
		}

		// Get month string
		var monthStr = '';
		var monthNo = date.getMonth();
		var months = ['January', 'February', 'March', 'April'
			, 'May', 'June', 'July', 'August'
			, 'September', 'October', 'November', 'December'];

		monthStr = months[monthNo];

		var dateStr = monthStr + ' ' + dayStr;

		return dateStr;
	}
	// Today, Yesterday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday	
	function getDayName(date){
		var tdate = new Date();
		tdate.setHours(0,0,0,0);

		date.setHours(0,0,0,0);

		var dayName = '';
		var oneDay = 24*60*60*1000;
		//Today
		if(tdate.getTime() == date.getTime()){
			dayName = 'Today';
		}
		//Yester day
		else if(tdate.getTime() - oneDay == date.getTime()){
			dayName = 'Yesterday';
		} else {
			//Sunday is 0, Monday is 1, and so on. (from 0 to 6)
			var weekDayNo = date.getDay();
			switch(weekDayNo){
				case 0:
	        dayName = "Sunday";
	        break;
		    case 1:
	        dayName = "Monday";
	        break;
		    case 2:
	        dayName = "Tuesday";
	        break;
		    case 3:
	        dayName = "Wednesday";
	        break;
		    case 4:
	        dayName = "Thursday";
	        break;
		    case 5:
	        dayName = "Friday";
	        break;
		    case 6:
	        dayName = "Saturday";
	        break;
			} //end of switch getDayName
		}
		return dayName;
	}// end of getDayName

	return {
		restrict: 'E',
		link: link,
		scope: {
			page: '='
		},
		templateUrl: 'idea_day_date_template.html'
	};
});

// Idea Vote
/*
<!-- Begin of Idea vote -->
<div ng-click="toggleVote(post, this)" class="{{post.isvoted?'upvote m-upvoted':'upvote'}}" data-component="VoteMarker" data-vote-id="{{post.objectID}}" data-vote-type="post">
	<a  class="upvote-link"></a>
	<span class="vote-count" data-vote-count="">{{post.votes.length}}</span>
</div>
<!-- End of Idea vote -->
*/

// Begin of idea directives
ideaHuntApp.directive('idea', function(){
	return {
		templateUrl : 'idea_template.html'
	};
});
// End of idea directive

ideaHuntApp.directive('ideaVote', ['ideaService', function(){
	console.log("inside ideaVote directive");

	function link(scope, element, attrs) {
		console.log("Inside ideaVote handler link handler");
	}

	return {
		restrict: 'E',
		link: link,
		scope: {
			idea: '='
		},
		controller: function($scope, ideaService, authService) {
      // toggle vote
			$scope.toggleVote = function(post) {
				console.log('Inside toggleVote for idea id: ' + post._id);
				console.log(post);

				if (typeof userId != 'undefined'){
					console.log('user id: ' + userId);
					ideaService.toggleIdeaVote(post._id, userId).then(
						function(data){
							console.log("ideaService toggleIdeaVote success ");
							console.log(data);
							post.isVote = !post.isVote;
							// set votes properly
							post.votes = data.data.data.votes;
							console.log(post);
						},
						function(err){
							console.log("Unable to toggle idea vote due to error " );
							console.log(err);
						}
					);
				}else {
					alert('Please login to vote idea.');
				}
			};
    },
		templateUrl: 'idea_vote_template.html'
	};
}]);


// Only idea title, tagline, clickable
ideaHuntApp.directive('IdeaBrief', ['ideaService', function(){
	console.log("inside IdeaBrief directive");
	return {
		restrict: 'E',
		scope: {
			idea: '='
		},
		templateUrl: 'idea_brief_template.html'
	};
}]);


// CommentBubbleIcon
ideaHuntApp.directive('CommentBubbleIcon', function(){
	console.log("inside CommentBubbleIcon directive");
	return {
		restrict: 'E',
		templateUrl: 'comment_bubble_icon_template.html'
	};
});

// Collection Icon
ideaHuntApp.directive('CollectionIcon', function(){
	console.log("inside CollectionIcon directive");
	return {
		restrict: 'E',
		templateUrl: 'collection_icon_template.html'
	};
});

