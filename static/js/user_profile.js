$(function() {
	$('#metrics > div').on('click', function() {
		if ($(window).width() < 900) {
			$(this).transition({scale: 1.35}, 150).transition({scale: 1}, 150);
		}
	});

	$('.questions-wrapper a').on('click', function(e) {
		e.preventDefault();
		url = $(this).attr("href");
		overlay = $(this).find('.background-image-overlay');
		overlay.transition({opacity: 0}, 150, function() {
			window.location.href = url;
		});	
	});

	/*	$('.questions-wrapper a').on('click', function(e) {
		e.preventDefault();
		q = $(this).parent('.question');
		pos = q.offset();
		console.log(pos);
		$('body').append("<div class='click-effect-wrapper'><div class='click-effect'></div></div>");
		$('.click-effect-wrapper').css({"text-align": "center", "position": "absolute", "left": pos.left, "top": pos.top, width: q.width(), height: q.height(), "overflow": "hidden"});
		$('.click-effect').css({"background": "#2eb398", "opacity": ".35", "border-radius": "50%", "height": "100%"}).transition({scale: 0}, 0).transition({scale: 2}, 400);


	});*/

	$('#followers-count').on('click', function() {
		var url = $(this).attr('class');
		$.get(url, function(data) {
			if (!$('#follower-wrapper').length) {
				if (!$('#following-wrapper').length) {
					$('#misc').append(data);
					$('.user img').height($('.user img').width());
					$('#follower-wrapper').height("100%");
					$('#misc .backer').transition({x: 0}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
					$('#follower-wrapper').transition({x: 0}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
				}
				else {
					$('#misc').append(data);
					$('.user img').height($('.user img').width());
					$('#follower-wrapper').height("100%");
					var z_index = parseInt($('#following-wrapper').css("z-index"));
					$('#mobile-tab-bar-wrapper').css({"z-index": z_index + 3});
					$('#misc .backer').css({"z-index": z_index + 1}).transition({x: "-100%"}, 0).transition({x: 0}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
					$('#follower-wrapper').css({"z-index": z_index + 2}).transition({x: "-100%"}, 0).transition({x: 0}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
				}
			}
			else if ($('#following-wrapper').css("z-index") >= $('#follower-wrapper').css("z-index")) {
				var z_index = parseInt($('#following-wrapper').css("z-index"));
				$('#mobile-tab-bar-wrapper').css({"z-index": z_index + 3});
				$('#misc .backer').css({"z-index": z_index + 1}).transition({x: "-100%"}, 0).transition({x: 0}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
				$('#follower-wrapper').css({"z-index": z_index + 2}).transition({x: "-100%"}, 0).transition({x: 0}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
			}
			else {
				$('#misc .backer').transition({x: 0}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
				$('#follower-wrapper').transition({x: 0}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
			}
		});
	});

	$('#following-count').on('click', function() {
		var url = $(this).attr('class');
		$.get(url, function(data) {
			if (!$('#following-wrapper').length) {
				if (!$('#follower-wrapper').length) {
					$('#misc').append(data);
					$('.user img').height($('.user img').width());
					$('#following-wrapper').height("100%");
					$('#misc .backer').transition({x: 0}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
					$('#following-wrapper').transition({x: 0}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
				}
				else {
					$('#misc').append(data);
					$('.user img').height($('.user img').width());
					$('#following-wrapper').height("100%");
					var z_index = parseInt($('#follower-wrapper').css("z-index"));
					$('#mobile-tab-bar-wrapper').css({"z-index": z_index + 3});
					$('#misc .backer').css({"z-index": z_index + 1}).transition({x: "-100%"}, 0).transition({x: 0}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
					$('#following-wrapper').css({"z-index": z_index + 2}).transition({x: "-100%"}, 0).transition({x: 0}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
				}
			}
			else if ($('#follower-wrapper').css("z-index") >= $('#following-wrapper').css("z-index")) {
				var z_index = parseInt($('#follower-wrapper').css("z-index"));
				$('#mobile-tab-bar-wrapper').css({"z-index": z_index + 3});
				$('#misc .backer').css({"z-index": z_index + 1}).transition({x: "-100%"}, 0).transition({x: 0}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
				$('#following-wrapper').css({"z-index": z_index + 2}).transition({x: "-100%"}, 0).transition({x: 0}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
			}
			else {
				$('#misc .backer').transition({x: 0}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
				$('#following-wrapper').transition({x: 0}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
			}
		});
	});

	$('#question-count').on('click', function() {
		if ($('#follower-wrapper').length && !$('#following-wrapper').length) {
			$('#follower-wrapper').transition({x: "-100%"}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
			$('#misc .backer').transition({x: "-100%"}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
		}
		if (!$('#follower-wrapper').length && $('#following-wrapper').length) {
			$('#following-wrapper').transition({x: "-100%"}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
			$('#misc .backer').transition({x: "-100%"}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
		}
		if ($('#follower-wrapper').length && $('#following-wrapper').length) {
			if ($('#follower-wrapper').css("z-index") >= $('#following-wrapper').css("z-index")) {
				$('#following-wrapper').transition({x: "-100%"}, 0);
				$('#follower-wrapper').transition({x: "-100%"}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
				$('#misc .backer').transition({x: "-100%"}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
			}
			else {
				$('#follower-wrapper').transition({x: "-100%"}, 0);
				$('#following-wrapper').transition({x: "-100%"}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
				$('#misc .backer').transition({x: "-100%"}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
			}
		}
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