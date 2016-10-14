$(function() {
	$('#followers-count, #following-count').on('click', function() {
		var url = $(this).attr('class');
		$.get(url, function(data) {
			if ($('#relation-wrapper').length) {
				$('#relation-wrapper').replaceWith(data);
			}
			else {
				$('#misc').prepend(data);
				$('#relation-wrapper').css({"display": "none"});
				if ($(window).width() >= 900) {
					var height = $('#relation-wrapper').height() - 15;
				}
				else {
					var height = $('#relation-wrapper').height() + 3;
				}
				$('#misc').height($('#misc').height() + height);
				$('.profile-questions').transition({y: height}, 200, function() {
					$('.profile-questions').transition({y: 0}, 0);
					$('#relation-wrapper').css({"opacity": 0, "display": "block"}).transition({opacity: 1}, 200);
					$('.user img').css({"height": $('.user img').eq(0).width() + 'px'});
				});
			}
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

	$(window).resize(function() {
		$('.user img').css({"height": $('.user img').eq(0).width() + 'px'});
	});
});

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}