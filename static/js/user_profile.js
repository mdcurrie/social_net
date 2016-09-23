$(function() {
	$('#followers-count').on('click', function() {
		var url = $(this).attr('class');
		$.get(url, function(data) {
			$('#relation-wrapper').remove();
			$('#misc').prepend(data);
			$('.user img').css({"height": $('.user img').eq(0).width() + 'px'});
		});
	});

	$('#following-count').on('click', function() {
		var url = $(this).attr('class');
		$.get(url, function(data) {
			$('#relation-wrapper').remove();
			$('#misc').prepend(data);
			$('.user img').css({"height": $('.user img').eq(0).width() + 'px'});
		});
	});

	$('#username-and-button button').on('click', function(e) {
		e.preventDefault();
		var url = $('#username-and-button form').attr('action');
		$.post(url, {_xsrf: getCookie('_xsrf')}, function(data) {
			if (data.redirect) {
				window.location.href = data.redirect;
			}
			else {
				$('#followers-count span').text(data.followers);
				$('#username-and-button button').text(data.display_text);
				if (data.display_text == 'Follow') {
					$('#username-and-button button').removeClass('active');
				}
				else {
					$('#username-and-button button').addClass('active');
				}
			}
		});
	});
});

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}