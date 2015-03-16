var express = require('express');
var reddit = require('redwrap');
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
		
		for (var post in posts) {
			var title = posts[post]["data"]["title"];
			var link = posts[post]["data"]["url"];
			jsonObj.push({"title": title, "link": link});

			if (post == (posts.length-1)) {
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
			jsonObj.push({"title": title, "link": link});

			if (post == (posts.length-1)) {
				returnResult();
			}
		}

	});

});

module.exports = router;
