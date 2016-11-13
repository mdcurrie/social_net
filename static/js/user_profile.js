$(function() {
	$('#followers-count').on('click', function() {
		var url = $(this).attr('class');

		if ($(window).width() < 900) {
			$(this).velocity({scaleX: 1.35, scaleY: 1.35}, 150).velocity({scaleX: 1, scaleY: 1}, 150);
		}

		$.get(url, function(data) {
			if (!$('#follower-wrapper').length) {
				if (!$('#following-wrapper').length) {
					$('#misc').append(data);
					user_img = $('.user img');
					overlay  = $('.user-relationship-overlay');
					backer   = $('#misc .backer');
					wrapper  = $('#follower-wrapper');

					sequence = [
						{e: user_img, p: {height: user_img.width()}, o: {duration: 0}},
						{e: overlay,  p: {height: user_img.width()}, o: {duration: 0}},
						{e: backer,   p: {translateX: "100%"},       o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
						{e: wrapper,  p: {translateX: "100%"},       o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
					];

					$.Velocity.RunSequence(sequence);
				}
				else {
					$('#misc').append(data);
					user_img = $('.user img');
					overlay  = $('.user-relationship-overlay');
					backer   = $('#misc .backer');
					wrapper  = $('#follower-wrapper');
					tab_bar  = $('#mobile-tab-bar-wrapper');
					z_index  = parseInt($('#following-wrapper').css("z-index"));

					sequence = [
						{e: user_img, p: {height: user_img.width()},              o: {duration: 0}},
						{e: overlay,  p: {height: user_img.width()},              o: {duration: 0}},
						{e: tab_bar,  p: {"z_index": z_index + 3},                o: {duration: 0}},
						{e: backer,   p: {visibility: "hidden"},                  o: {duration: 0}},
						{e: backer,   p: {translateX: 0, "z-index": z_index + 1}, o: {duration: 0}},
						{e: wrapper,  p: {"z-index": z_index + 2},                o: {duration: 0}},
						{e: backer,   p: {visibility: "visibile"},                o: {duration: 0}},
						{e: backer,   p: {translateX: "100%"},                    o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
						{e: wrapper,  p: {translateX: "100%"},                    o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
					];

					$.Velocity.RunSequence(sequence);
				}
			}
			else if ($('#following-wrapper').css("z-index") >= $('#follower-wrapper').css("z-index")) {
				backer  = $('#misc .backer');
				wrapper = $('#follower-wrapper');
				tab_bar = $('#mobile-tab-bar-wrapper');
				z_index = parseInt($('#following-wrapper').css("z-index"));

				sequence = [
					{e: tab_bar,  p: {"z_index": z_index + 3},                o: {duration: 0}},
					{e: backer,   p: {visibility: "hidden"},                  o: {duration: 0}},
					{e: backer,   p: {translateX: 0, "z-index": z_index + 1}, o: {duration: 0}},
					{e: wrapper,  p: {translateX: 0, "z-index": z_index + 2}, o: {duration: 0}},
					{e: backer,   p: {visibility: "visibile"},                o: {duration: 0}},
					{e: backer,   p: {translateX: "100%"},                    o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: wrapper,  p: {translateX: "100%"},                    o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
				];

				$.Velocity.RunSequence(sequence);
			}
			else {
				backer  = $('#misc .backer');
				wrapper = $('#follower-wrapper');
				tab_bar = $('#mobile-tab-bar-wrapper');
				z_index = parseInt($('#following-wrapper').css("z-index"));

				sequence = [
					{e: tab_bar,  p: {"z_index": z_index + 3}, o: {duration: 0}},
					{e: backer,   p: {"z-index": z_index + 1}, o: {duration: 0}},
					{e: wrapper,  p: {"z-index": z_index + 2}, o: {duration: 0}},
					{e: backer,   p: {translateX: "100%"},     o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: wrapper,  p: {translateX: "100%"},     o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
				];

				$.Velocity.RunSequence(sequence);
			}
		});
	});

	$('#following-count').on('click', function() {
		var url = $(this).attr('class');

		if ($(window).width() < 900) {
			$(this).velocity({scaleX: 1.35, scaleY: 1.35}, 150).velocity({scaleX: 1, scaleY: 1}, 150);
		}

		$.get(url, function(data) {
			if (!$('#following-wrapper').length) {
				if (!$('#follower-wrapper').length) {
					$('#misc').append(data);
					user_img = $('.user img');
					overlay  = $('.user-relationship-overlay');
					backer   = $('#misc .backer');
					wrapper  = $('#following-wrapper');

					sequence = [
						{e: user_img, p: {height: user_img.width()}, o: {duration: 0}},
						{e: overlay,  p: {height: user_img.width()}, o: {duration: 0}},
						{e: backer,   p: {translateX: "100%"},       o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
						{e: wrapper,  p: {translateX: "100%"},       o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
					];

					$.Velocity.RunSequence(sequence);
				}
				else {
					$('#misc').append(data);
					user_img = $('.user img');
					overlay  = $('.user-relationship-overlay');
					backer   = $('#misc .backer');
					wrapper  = $('#following-wrapper');
					tab_bar  = $('#mobile-tab-bar-wrapper');
					z_index  = parseInt($('#follower-wrapper').css("z-index"));

					sequence = [
						{e: user_img, p: {height: user_img.width()},              o: {duration: 0}},
						{e: overlay,  p: {height: user_img.width()},              o: {duration: 0}},
						{e: tab_bar,  p: {"z_index": z_index + 3},                o: {duration: 0}},
						{e: backer,   p: {visibility: "hidden"},                  o: {duration: 0}},
						{e: backer,   p: {translateX: 0, "z-index": z_index + 1}, o: {duration: 0}},
						{e: wrapper,  p: {"z-index": z_index + 2},                o: {duration: 0}},
						{e: backer,   p: {visibility: "visibile"},                o: {duration: 0}},
						{e: backer,   p: {translateX: "100%"},                    o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
						{e: wrapper,  p: {translateX: "100%"},                    o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
					];

					$.Velocity.RunSequence(sequence);
				}
			}
			else if ($('#follower-wrapper').css("z-index") >= $('#following-wrapper').css("z-index")) {
				backer   = $('#misc .backer');
				wrapper  = $('#following-wrapper');
				tab_bar  = $('#mobile-tab-bar-wrapper');
				z_index  = parseInt($('#follower-wrapper').css("z-index"));

				sequence = [
					{e: tab_bar,  p: {"z_index": z_index + 3},                o: {duration: 0}},
					{e: backer,   p: {visibility: "hidden"},                  o: {duration: 0}},
					{e: backer,   p: {translateX: 0, "z-index": z_index + 1}, o: {duration: 0}},
					{e: wrapper,  p: {translateX: 0, "z-index": z_index + 2}, o: {duration: 0}},
					{e: backer,   p: {visibility: "visibile"},                o: {duration: 0}},
					{e: backer,   p: {translateX: "100%"},                    o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: wrapper,  p: {translateX: "100%"},                    o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
				];

				$.Velocity.RunSequence(sequence);
			}
			else {
				backer   = $('#misc .backer');
				wrapper  = $('#following-wrapper');
				tab_bar  = $('#mobile-tab-bar-wrapper');
				z_index  = parseInt($('#follower-wrapper').css("z-index"));

				sequence = [
					{e: tab_bar,  p: {"z_index": z_index + 3}, o: {duration: 0}},
					{e: backer,   p: {"z-index": z_index + 1}, o: {duration: 0}},
					{e: wrapper,  p: {"z-index": z_index + 2}, o: {duration: 0}},
					{e: backer,   p: {translateX: "100%"},     o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: wrapper,  p: {translateX: "100%"},     o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
				];

				$.Velocity.RunSequence(sequence);
			}
		});
	});

	$('#question-count').on('click', function() {

		if ($(window).width() < 900) {
			$(this).velocity({scaleX: 1.35, scaleY: 1.35}, 150).velocity({scaleX: 1, scaleY: 1}, 150);
		}

		other_wrapper = false;
		if ($('#follower-wrapper').length && !$('#following-wrapper').length) {
			wrapper = $('#follower-wrapper');
			backer  = $('#misc .backer');
		}
		if (!$('#follower-wrapper').length && $('#following-wrapper').length) {
			wrapper = $('#following-wrapper');
			backer  = $('#misc .backer');
		}
		if ($('#follower-wrapper').length && $('#following-wrapper').length) {
			if ($('#follower-wrapper').css("z-index") >= $('#following-wrapper').css("z-index")) {
				wrapper = $('#follower-wrapper');
				backer  = $('#misc .backer');
				other_wrapper = $('#following-wrapper');
			}
			else {
				wrapper = $('#following-wrapper');
				backer  = $('#misc .backer');
				other_wrapper = $('#follower-wrapper');
			}
		}

		if (other_wrapper) {
			sequence = [
				{e: other_wrapper, p: {translateX: 0}, o: {duration: 0}},
				{e: wrapper,       p: {translateX: 0}, o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
				{e: backer,        p: {translateX: 0}, o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			];
		}
		else {
			sequence = [
				{e: wrapper, p: {translateX: 0}, o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
				{e: backer,  p: {translateX: 0}, o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			];
		}

		$.Velocity.RunSequence(sequence);
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
		$('.user img, .user-relationship-overlay').css({"height": $('.user img').eq(0).width() + 'px'});
	});
});

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}