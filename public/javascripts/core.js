var redditApp = angular.module('redditApp', ['ngMaterial'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('pink', {
      'default': '400', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('indigo', {
      'default': '400' // use shade 200 for default, and keep all other shades the same
    });
});

redditApp.controller('mainController', ['$scope','$http', function($scope, $http){
	$scope.postList = {};
	$scope.isLoading = false;
	$scope.subreddit = "";
	$scope.defaultSubreddits = [];
	$scope.isInit = true;

	$scope.$watch('subreddit', function() {
		if (!$scope.isInit) {
			$scope.getPosts();
		}
	});

	$scope.getPosts = function(sub) {
		$scope.isLoading = true;
		$scope.postList = {};
		$http.get('/sub/' + sub).
		success(function(data, status,headers, config){
			$scope.postList = data;
			$scope.isLoading = false;
		}).
		error(function(data){
			console.log('error');
		});
	};

	$scope.getDefaults = function() {
		$http.get('/defaults').
		success(function(data, status, headers, config){
			$scope.defaultSubreddits = data;
		}).
		error(function(data){
			console.log('Error: ' +data);
		})
	};

	$scope.getFrontPage = function() {
		$scope.postList = {};
		$scope.isLoading = true;
		$http.get('/frontpage').
		success(function(data, status,headers, config){
			$scope.postList = data;
			$scope.isLoading = false;
			$scope.isInit = false;
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

redditApp.directive('renderImage', function($compile) {
	return {
		restrtict: 'E', 
		link: function(scope, element, attrs){
			var html = '';
			var link = attrs.renderImage;
			var domain = attrs.renderImageDomain;
			var linkExtension = link.split('.').pop();
			console.log(domain);

			try {
				if (linkExtension == "gifv") {
					var linkName = link.split('.gifv');
					html = '<video autoplay loop muted> <source type="video/webm" src="'+ linkName[0] + '.webm"> <source type="video/mp4" src="'+linkName[0]+'.mp4"></video>';
					var e = $compile(html)(scope);
					element.replaceWith(e);
				}

				if (domain.indexOf('gfycat') > -1) {
					var linkName = link.split('gfycat');
					var webmLink = linkName[0]+"fat.gfycat"+linkName[1]+".webm";
					var mp4Link = linkName[0]+"fat.gfycat"+linkName[1]+".mp4";
					html = '<video autoplay loop muted> <source type="video/webm" src="'+webmLink+'"> <source type="video/mp4" src="'+mp4Link+'"></video>';
					var e = $compile(html)(scope);
					element.replaceWith(e);
				}

				if (link.indexOf('youtube') > -1) {
					var linkName = link.split('watch?v=');
					var linkIndex = linkName[1];
					html = '<iframe width="100%" height="315" src="https://www.youtube.com/embed/'+ linkIndex +'" frameborder="0" allowfullscreen></iframe>';
					var e = $compile(html)(scope);
					element.replaceWith(e);
				}

				if (!((/\.(gif|jpg|jpeg|tiff|png)$/i).test(link))){
					html = '<img id="{{key}}" fallback-src="/images/default.png" src="{{value.thumbnail}}">';
					var e = $compile(html)(scope);
					element.replaceWith(e);
				}
			} 
			catch (e) {
				console.log(e);
				console.log(link);
			}
		}
	};
});

redditApp.directive('getParentComments', function(){

});