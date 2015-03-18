#impurge

This is a simple module meant to extract image URLS from imgur


Example:
```js
var impurge = require('impurge');
  impurge.purge("http://imgur.com/IvpcP", function  (e,r) {
  console.log(r)
});
```

will result in:  

```js
http://i.imgur.com/IvpcP.jpg
```

The new test file included will check the currency of the regular expressions against live reddit data to ensure imgur is not changing link formats and will look for any it does not recognize


I have added a few additional methods that I used for testing the accuracy of my regex's
```js
impurge.is_imgur(url); //will output true if the url is imgur
```

the following takes a string input and will return an array of imgur links contained within
```js
impurge.get_text_imgur_links(text); // will return an array of links
```

and finally i exposed a function to determine the link type (previously used internally)
```js
impurge.determine_link_type(url, function(err, type, id, i_url){
	//err is given if link is not recognized
	//type is image_url, album_url, gallery_url, hash_url
	//id is the id for the link (if applicable)
	//i_url is the image url if this is a direct image
});
```
