"use strict";

var posts = module.parent.require('./posts');

var theme = {};

theme.addTopicsVotesInCategory = function(params, callback) {
    var mainPids = params.topics.map(function(topic) {
        return topic.mainPid;
    });

    posts.getPostsFields(mainPids, ['votes'], function(err, postsFields) {
        postsFields.forEach(function(postFields, index) {
            params.topics[index].votes = postFields['votes'];
        });

        callback(null, params);
    });
};

module.exports = theme;
