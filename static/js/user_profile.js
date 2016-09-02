$(function() {
	$('#followers-count').on('click', function() {
		var url = $(this).attr('class');
		$.get(url, function(data) {
			$('#relation').html(data);
			$('#relation').css({"display": "block", "height": "initial"});
		});
	});

	$('#following-count').on('click', function() {
		var url = $(this).attr('class');
		$.get(url, function(data) {
			$('#relation').html(data);
			$('#relation').css({"display": "block"});
		});
	});
});