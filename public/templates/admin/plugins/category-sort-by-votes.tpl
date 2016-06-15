<div class="row">
	<div class="col-lg-12">
		<div class="panel panel-default">

			<div class="panel-heading">category sort by votes</div>

			<div class="panel-body">

				<div class="alert alert-info">
				Total Topics: <strong>{topicCount}</strong> Topics Indexed: <strong id="topics-indexed">{topicsIndexed}</strong>
				</div>
				<div class="progress">
					<div class="topic-progress progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;">0%</div>
				</div>

				<button class="btn btn-warning" id="reindex">Re Index</button>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
'use strict';
/* globals app, socket, config */
$(document).ready(function() {
	var intervalId = 0;

	function startProgress(msg) {
		function checkProgress() {
			socket.emit('admin.plugins.categorySortByVotes.checkProgress', function(err, progress) {
				if (err) {
					clearProgress();
					return app.alertError(err.message);
				}

				if (progress.topicsPercent >= 100) {
					clearInterval(intervalId);
					progress.topicsPercent = 100;
					app.alertSuccess(msg);
				}
				if (msg === 'Content Indexed!') {
					$('#topics-indexed').text(progress.topicsProcessed);
				}
				$('.topic-progress').css('width', progress.topicsPercent + '%').text(progress.topicsPercent + '%');
			});
		}

		clearProgress();
		checkProgress();

		intervalId = setInterval(checkProgress, 750);
	}

	function clearProgress() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = 0;
		}
		$('.progress-bar').css('width', '0%').text('0%');
	}

	$('#reindex').on('click', function() {
		socket.emit('admin.plugins.categorySortByVotes.reindex', function(err, data) {
			if (err) {
				app.alertError(err.message);
				clearProgress();
			}
			$('#topics-indexed').text(data.topicsIndexed);
		});
		startProgress('Content Indexed!');
		return false;
	});
});

</script>