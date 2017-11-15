"use strict";

var posts = module.parent.require('./posts');
var async = require.main.require('async');
var db = require.main.require('./src/database');
var batch = require.main.require('./src/batch');
var topics = require.main.require('./src/topics');
var socketAdmin = require.main.require('./src/socket.io/admin');
var user = require.main.require('./src/user');

var theme = {};
var topicCount = 0;
var topicsProcessed = 0;
var noop = function (){};

socketAdmin.plugins.categorySortByVotes = {};
socketAdmin.plugins.categorySortByVotes.reindex = function(socket, data, callback) {
	topicsProcessed = 0;
	batch.processSortedSet('topics:tid', function(tids, next) {
		topics.getTopicsFields(tids, ['mainPid', 'tid', 'cid'], function (err, data){
			var mainPids = data.map(function(topic) {
				return topic.mainPid;
			});

			posts.getPostsFields(mainPids, ['pid', 'votes', 'upvotes', 'downvotes'], function(err, postsFields) {
				var map = {};
				postsFields.forEach(function(postField, index) {
					if (postField['upvotes'] || postField['downvotes'])
						map[postField['pid']] = (postField['upvotes'] - postField['downvotes']) || 0;
					else
						map[postField['pid']] = postField['votes'] || 0;
				});

				data.forEach(function (topic, index){
					db.sortedSetAdd('cid:' + topic['cid'] + ':tids:votes', map[topic['mainPid']], topic['tid'], noop);
				});

				topicsProcessed += tids.length;
				next();
			});
		});
	}, function(err) {});
	callback();
};

socketAdmin.plugins.categorySortByVotes.checkProgress = function(socket, data, callback) {
	var topicsPercent = topicCount ? (topicsProcessed / topicCount) * 100 : 0;
	var checkProgress = {
		topicsPercent: Math.min(100, topicsPercent.toFixed(2)),
		topicsProcessed: topicsPercent >= 100 ? topicCount : topicsProcessed
	};
	callback(null, checkProgress);
};

function renderAdmin(req, res) {
	db.getObjectFields('global', ['topicCount'], function (err, data){
		topicCount = data.topicCount;
		res.render('admin/plugins/category-sort-by-votes', data);
	});
}

theme.getSettings = function (data, callback) {
	if (data.settings && !data.settings.categoryTopicSort) {
		data.settings.categoryTopicSort = 'most_votes';
	}
	callback(null, data);
};
theme.init = function (data, callback) {
	data.router.get('/admin/plugins/category-sort-by-votes', data.middleware.admin.buildHeader, renderAdmin);
	data.router.get('/api/admin/plugins/category-sort-by-votes', renderAdmin);

	callback(null, data);
};

function voteHelper(data, type, callback) {
	posts.getPostFields(data['pid'], ['tid', 'votes'], function (err, post){
		topics.getTopics([post['tid']], data['uid'], function (err, topic){
			if (!topic && topic.length === 0) return;
			topic = topic[0];
			if (topic['mainPid'] != data['pid']) return;

			var inc = 0;
			if (type === 'unvote') inc = 0;
			else if (type === 'upvote') inc = 1;
			else if (type === 'downvote') inc = -1;

			if (data['current'] === 'unvote') inc += 0;
			else if (data['current'] === 'downvote') inc += 1;
			else if (data['current'] === 'upvote') inc -= 1;
			callback('cid:' + topic['cid'] + ':tids:votes', inc, topic['tid']);
		})
	});
}

theme.upvote = function (data) {
	voteHelper(data, 'upvote', function (key, inc, tid){
		db.sortedSetIncrBy(key, inc, tid, noop);
	});
};

theme.downvote = function (data) {
	voteHelper(data, 'downvote', function (key, inc, tid){
		db.sortedSetIncrBy(key, inc, tid, noop);
	});
};

theme.unvote = function (data) {
	voteHelper(data, 'unvote', function (key, inc, tid){
		db.sortedSetIncrBy(key, inc, tid, noop);
	});
};

theme.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/category-sort-by-votes',
		icon: 'fa-edit',
		name: 'Category Sort By Votes'
	});

	callback(null, header);
};

theme.addTopicsVotesInCategory = function(params, callback) {
    var mainPids = params.topics.map(function(topic) {
        return topic.mainPid;
    });

    posts.getPostsFields(mainPids, ['votes', 'upvotes', 'downvotes'], function(err, postsFields) {
        postsFields.forEach(function(postFields, index) {
	        if (postFields['upvotes'] || postFields['downvotes'])
                params.topics[index].votes = (postFields['upvotes'] - postFields['downvotes']) || 0;
	        else
		        params.topics[index].votes = postFields['votes'] || 0;
        });

        callback(null, params);
    });
};

theme.createTopic = function (data, callback) {
	var tid = data.topic.tid;
	var cid = data.topic.cid;
	db.sortedSetAdd('cid:' + cid + ':tids:votes', 0, tid, noop);
	callback(null, data);
}

theme.getSortedSetRangeDirection = (data, callback) => {
	if (data.sort==='most_votes') {
	  data.direction = 'highest-to-lowest';
	}
	return callback(null, data);
  }
  
theme.buildTopicsSortedSet = (data, callback) => {
	if (data.data.sort==='most_votes') {
		data.set="cid:" + data.data.cid + ":tids:votes";
	}
	return callback(null, data);
  }

module.exports = theme;
