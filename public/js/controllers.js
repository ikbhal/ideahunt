var phonecatApp = angular.module('ideaHuntApp', []);


phonecatApp.controller('IdeaHuntListCtrl', function ($scope) {
 	console.log("Inside IdeaHuntListCtrl");

	$scope.showUserMenuFlag = true;
	$scope.showUserMenu = 'none';
	
	$scope.posts = data.hits;
	$scope.addPostFormClass ="new-post-modal hidden";
	$scope.bodyExtraClassOnAddPostForm  ="";

	// ToDO: test author
	var author = $scope.posts[0].author;
	
	$scope.newPost = {name:'', tagline:'', url:'', vote_count:0, comment_count:0, 'author': author};

	// Show add post form
	$scope.showAddPostForm = function(){
		console.log("Inside showAddPostForm");
		$scope.addPostFormClass ="new-post-modal";
		$scope.bodyExtraClassOnAddPostForm ="showing-discussion";

	};

	// Hide add post form
	$scope.hideAddPostForm = function(){
		console.log("Inside hideAddPostForm");
		$scope.addPostFormClass ="new-post-modal hidden";
		$scope.bodyExtraClassOnAddPostForm ="";
	};

	// Up vote the post by member
	$scope.upVotePost = function() {

	};

	// remove the vote for the post by voted by member.
	$scope.downvotePost = function() {

	};

	// toggle vote
	$scope.toggleVote = function(post) {
		console.log("Inside toggleVote");
		post.isVote = !post.isVote;
		console.log(post);
	};
	// Handle add post.
	$scope.addPost = function(){
		console.log("Inside add post");
		console.log($scope.newPost);

		// Add new post to post.
		$scope.posts.push($scope.newPost);

		// Reset newPost
		$scope.newPost = {name:'', tagline:'', url:''};

		//Hide addPost form
		$scope.hideAddPostForm();
	};

	$scope.toggleUserMenu = function(){
		$scope.showUserMenuFlag = !$scope.showUserMenuFlag;

		if($scope.showUserMenuFlag){
			$scope.showUserMenu = 'block';
		}else {
			$scope.showUserMenu = 'none';
		}
	};
});