var redditApp = angular.module('redditApp', ['ngMaterial']);

redditApp.controller('mainController', ['$scope','$http', function($scope, $http){
	$scope.postList = {};
	$scope.isLoading = false;
	$scope.subreddit = "";

	$scope.$watch('subreddit', function() {
		console.log($scope.subreddit);
		$scope.getPosts();
	});

	$scope.getPosts = function() {
		console.log($scope.subreddit);
		$scope.isLoading = true;
		$scope.postList = {};
		$http.get('/sub/' + $scope.subreddit).
		success(function(data, status,headers, config){
			$scope.postList = data;
			$scope.isLoading = false;
		}).
		error(function(data){
			console.log('error');
		});
	};

	$scope.getFrontPage = function() {
		$scope.postList = {};
		$scope.isLoading = true;
		$http.get('/frontpage').
		success(function(data, status,headers, config){
			$scope.postList = data;
			$scope.isLoading = false;
		}).
		error(function(data){
			console.log('error');
		});
	};

}]);

