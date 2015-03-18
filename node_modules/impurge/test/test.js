var request = require('request');
var stream = require('stream');
var should = require('should');
var assert = require('assert');
var impurge = require('../impurge.js');


var album_url;
var gallery_url;
var hash_url;
var image_url;
//This function tests impurge by getting 100 gonewild posts
function getImgurPosts() {
    var readStream = new stream.Readable({
        objectMode: true
    });
    var started = false;
    try {
        request({
            url: 'http://www.reddit.com/r/gonewild.json?limit=100&after=',
            json: true
        }, function(err, res, obj) {

            //needs to check to see if this is a 404 json
            obj.data.children.forEach(function(item) {
                if (item.kind === 't3') readStream.emit('url', item.data.url);
            });
            readStream.emit('end')
        });
    } catch (error) {
        callback('Error retrieving ' + test, null)
    }
    readStream._read = function(n) {
        if (!started) loop();
        if (!started) userJSON(username);
        started = true;
    };
    return readStream;
};

//process the posts with imgur
var processWithImgur = function(url) {
    if (!impurge.is_imgur(url)) {
        console.log('**e**NOT IMGUR', url);
    } else {
        impurge.determine_link_type(url, function(err, type, id, i_url) {
            if (err) {
                console.log('**e**' + err, url);
            } else {
                //used for potential troubleshooting
                //console.log(url, 'is a ', type, 'with id:', id, 'and url', i_url);
                if (type === 'album_url') album_url = url;
                if (type === 'galley_url') gallery_url = url;
                if (type === 'hash_url') hash_url = url;
                if (type === 'image_url') image_url = url;

            }
            // impurge.purge(url, function(err, url) {
            //     console.log('err');
            // });
        });
    }
}

//need to look into converting this to the transform type in blog post below 
//http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/


startTests = function() {
    before(function(done) {
        getImgurPosts()
            .on('url', function(url) {
                processWithImgur(url);
            }).on('end', function(end) {
                done();
            });
    });
    it('determine_link_type should have found album_url', function(done) {
        console.log('testing with album_url ', album_url);
        album_url.should.not.equal(undefined);
        done();
    });

    it('determine_link_type should have found gallery_url', function(done) {
        console.log('testing with gallery_url ', gallery_url);
        gallery_url.should.not.equal(undefined);
        done();
    });

    it('determine_link_type should have found hash_url', function(done) {
        console.log('testing with hash_url ', hash_url);
        hash_url.should.not.equal(undefined);
        done();
    });

    it('determine_link_type should have found image_url', function(done) {
        console.log('testing with image_url ', image_url);
        image_url.should.not.equal(undefined);
        done();
    });
    ///////////////////
    ///////////////////
    it('image_url should find 1 picture', function(done) {
        impurge.purge(image_url, function(err, urls) {
            console.log(urls);
            urls.should.have.lengthOf(1);
            done();
        });
    });
    it('hash_url should find picture', function(done) {
        impurge.purge(hash_url, function(err, urls) {
            console.log(urls);
            urls.should.have.lengthOf(1);
            done();
        });
    });
    it('album_url should find picture', function(done) {
        impurge.purge(album_url, function(err, urls) {
            console.log(urls);
            urls.should.have.lengthOf(2);
            done();
        });
    });
}
startTests();