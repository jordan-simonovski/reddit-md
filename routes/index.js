var express = require('express');
var reddit = require('redwrap');
var impurge = require('impurge');
var router = express.Router(); 
var defaultSubreddits = ["announcements", "Art", "AskReddit", "askscience", "aww", "blog", "creepy", "dataisbeautiful", "diy", "documentaries", "earthporn", "explainlikeimfive", "fitness", "food", "funny", "gadgets", "gaming", "getmotivated", "gifs", "history", "iama", "internetisbeautiful", "jokes", "lifeprotips", "listentothis", "mildlyinteresting", "movies", "music", "news", "nosleep", "nottheonion", "oldschoolcool", "personalfinance", "philosophy", "photoshopbattles", "pics", "science", "showerthoughts", "space", "sports", "television", "tifu", "todayilearned", "twoxchromosomes", "upliftingnews", "videos", "worldnews", "writingprompts"];

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.html', { title: 'Reddit Material' });
});

router.get('/defaults', function(req, res){
	res.send(defaultSubreddits);
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
			var thumbnail = posts[post]["data"]["thumbnail"];
			var domain = posts[post]["data"]["domain"];
			var score = posts[post]["data"]["score"];
			var permalink = posts[post]["data"]["permalink"];
			var subreddit = posts[post]["data"]["subreddit"];
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
				jsonObj.push({"title": title, "link": link, "thumbnail": thumbnail, "domain": domain, "score": score, "permalink": permalink, "subreddit": subreddit});
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
			var thumbnail = posts[post]["data"]["thumbnail"];
			var domain = posts[post]["data"]["domain"];
			var score = posts[post]["data"]["score"];
			var permalink = posts[post]["data"]["permalink"];
			var subreddit = posts[post]["data"]["subreddit"];
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
				jsonObj.push({"title": title, "link": link, "thumbnail": thumbnail, "domain": domain, "score": score, "permalink": permalink, "subreddit": subreddit});
			}

			if (post == (posts.length-1) ) {
				returnResult();
			}
		}

	});

});

module.exports = router;
