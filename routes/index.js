var express = require('express');
var reddit = require('redwrap');
var impurge = require('impurge');
var router = express.Router(); 

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.html', { title: 'Reddit Material' });
});

router.get('/frontpage', function(req, res){
	var jsonObj = [];

	var returnResult = function(){
		res.send(jsonObj);
	}

	reddit.list('hot', function(err, data, res){
		posts = data["data"]["children"];
		var pushedObjects = 0;
		
		for (var post in posts) {
			var title = posts[post]["data"]["title"];
			var link = posts[post]["data"]["url"];
			var safeToPush = false;

			if (link.indexOf('imgur') > -1) {
				impurge.purge(link, function (e,r){
					link = r[0];
					safeToPush = true;
				});
			} else {
				safeToPush = true;
			}

			if (safeToPush == true) {
				jsonObj.push({"title": title, "link": link});
			}

			if (post == (posts.length-1) ) {
				returnResult();
			}
		}

	});

});

router.get('/sub/:subreddit', function(req, res){
	var subReddit = "" + req.params.subreddit;
	var jsonObj = [];

	var returnResult = function(){
		res.send(jsonObj);
	}

	reddit.r(subReddit, function(err, data, res){
		posts = data["data"]["children"];
		
		for (var post in posts) {
			var title = posts[post]["data"]["title"];
			var link = posts[post]["data"]["url"];
			var safeToPush = false;

			if (link.indexOf('imgur') > -1) {
				impurge.purge(link, function (e,r){
					link = r[0];
					safeToPush = true;
				});
			} else {
				safeToPush = true;
			}

			if (safeToPush == true) {
				jsonObj.push({"title": title, "link": link});
			}

			if (post == (posts.length-1) ) {
				returnResult();
			}
		}

	});

});

module.exports = router;
