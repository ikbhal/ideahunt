var phonecatApp = angular.module('ideaHuntApp', []);


phonecatApp.controller('IdeaHuntListCtrl', function ($scope) {
 	console.log("Inside IdeaHuntListCtrl");

	$scope.posts = data.hits;
});