var redditApp = angular.module('redditApp', ['ngMaterial']);

redditApp.controller('mainController', ['$scope','$http', function($scope, $http){
	$scope.postList = {};
	$scope.isLoading = false;
	$scope.subreddit = "";

	$scope.$watch('subreddit', function() {
		$scope.getPosts();
	});

	$scope.getPosts = function() {
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
			$scope.parseLinks();
		}).
		error(function(data){
			console.log('error');
		});
	};

	$scope.parseLinks = function() {
		$.each($scope.postList, function(index, value){
			if ((value.link).indexOf('imgur') > -1) {

				$http.get('https://api.imgur.com/3/image/')
			}
		});
	};

}]);

redditApp.directive('fallbackSrc', function() {

});
