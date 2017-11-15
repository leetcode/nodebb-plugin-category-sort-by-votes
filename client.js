$(window).on('action:ajaxify.end', function () {
  require(['translator'], function(translator) {
    translator.translate('[[topic:most_votes]]', function(most_votes) { 
      var sortEl = $('.category [component="thread/sort"] ul');
      sortEl.append('<li><a href="#" class="most_votes" data-sort="most_votes"><i class="fa fa-fw ' + (config.categoryTopicSort === 'most_votes' ? 'fa-check' : '') + '"></i> ' + most_votes + '</a></li>'); 
    });
  });
});
