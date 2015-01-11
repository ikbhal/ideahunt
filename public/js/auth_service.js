ideaHuntApp.service('authService', function($http){
	console.log("Inside authService");
	this.userId = '';

	if(typeof userId != 'undefined'){
		//load  user id
		this.userId = userId;
	}
	this.getUserId = function(){
		console.log('Inside authService.getUserId');
		return this.userId;
	};

	this.setUserId = function(uid){
		console.log('Inside authService.setUserId');
		this.userId = uid;
	};
});
