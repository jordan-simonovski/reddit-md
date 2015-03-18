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
		}).
		error(function(data){
			console.log('error');
		});
	};

}]);

redditApp.directive('fallbackSrc', function() {
  var fallbackSrc = {
    link: function postLink(scope, element, attrs) {
      element.bind('error', function() {
        angular.element(this).attr("src", attrs.fallbackSrc);
      });
    }
   }
   return fallbackSrc;
});
