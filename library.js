"use strict";

var topics = module.parent.require('./topics');

var theme = {};

function addPostData(params, templateData, callback) {
    var tids = templateData.topics.map(function(topic) {
        return topic.tid;
    });

    topics.getMainPosts(tids, templateData.uid, function(err, mainPosts) {
        mainPosts.forEach(function(post, index) {
            templateData.topics[index].votes = post.votes;
        });

        callback(null, params);
    });
}

theme.addTopicsVotesInCategory = function(params, callback) {
	addPostData(params, params, callback);
};

theme.addTopicsVotes = function(params, callback) {
	addPostData(params, params.templateData, callback);
};

module.exports = theme;
