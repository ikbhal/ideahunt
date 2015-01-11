// Begin of ideaService 
ideaHuntApp.service('ideaService', function($http){
	this.addIdea = function(idea){
		console.log('Inside IdeaService.addIdea');
		console.log(idea);
		return $http.post('http://toprecur.cloudapp.net/ideas', idea);
	};

	this.getIdeas = function(){
		console.log('Inside IdeaService.getIdeas');
		return $http.get('http://toprecur.cloudapp.net/ideas');
	};

	this.toggleIdeaVote = function(ideaId, userId){
		console.log("Inside toggle idea vote");
		var voteURL = 'http://toprecur.cloudapp.net/ideas/' + ideaId + '/vote'
		console.log('userId:' + userId);
		return $http.post(voteURL, {'userId' : userId});
	};

	// Get ideas by page id where 0 current day, 1 previous day, 2  two days ago
	this.getIdeasByPageId = function(page){
		console.log('Inside IdeaService.getIdeasByPageId');
		var idea_page_url = 'http://toprecur.cloudapp.net/ideas?page=' + page;

		console.log("Hitting url: " + idea_page_url);
		return $http.get(idea_page_url);
	};
});
// End of ideaService 
