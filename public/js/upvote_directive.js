ideaHuntApp.directive('upvote', function($compile){
	var vote = {};

 var upvoteLinker = function(scope, element, attrs) {
      
      $compile(element.contents())(scope);
  }

	return {
		restrict: 'E',
		link: upvoteLinker,
		templateUrl : 'upvote_template.html'
	};
});