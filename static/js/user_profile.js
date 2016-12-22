$(function() {
	follower_url = $('#followers-count').attr('class');
	$.get(follower_url, function(data) {
		$('#misc').append(data);
		user_img = $('.user img');
		overlay  = $('.user-relationship-overlay');
		width    = user_img.width();
		sequence = [
			{e: user_img, p: {height: width},   o: {duration: 0}},
			{e: overlay,  p: {height: width},   o: {duration: 0}}
		];
		$.Velocity.RunSequence(sequence);
	});

	following_url = $('#following-count').attr('class');
	$.get(following_url, function(data) {
		$('#misc').append(data);
		user_img = $('.user img');
		overlay  = $('.user-relationship-overlay');
		width    = user_img.width();
		sequence = [
			{e: user_img, p: {height: width},   o: {duration: 0}},
			{e: overlay,  p: {height: width},   o: {duration: 0}}
		];
		$.Velocity.RunSequence(sequence);
	});

	$('#followers-count').on('click', function() {
		var url = $(this).attr('class');

		if (window.innerWidth < 900) {
			triangle = $('#triangle-wrapper');
			sequence = [
				{e: triangle, p: {translateX: "33.33%"}, o: {duration: 300, begin: function() {getFollowers(url);}}}
			];
			$.Velocity.RunSequence(sequence);
		}
		else {
			getFollowers(url);
		}
	});

	$('#following-count').on('click', function() {
		var url = $(this).attr('class');

		if (window.innerWidth < 900) {
			triangle = $('#triangle-wrapper');
			sequence = [
				{e: triangle, p: {translateX: "66.66%"}, o: {duration: 300, begin: function() {getFollowing(url);}}}
			];
			$.Velocity.RunSequence(sequence);
		}
		else {
			getFollowing(url);
		}
	});

	$('#question-count').on('click', function() {

		question  = $('.profile-questions');
		triangle  = $('#triangle-wrapper');
		questions = $('.profile-questions');
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
				{e: questions,     p: {opacity: 1},       o: {duration: 0}},
				{e: backer,        p: {opacity: 1},       o: {duration: 0}},
				{e: other_wrapper, p: {translateX: 0},    o: {duration: 0}},
				{e: triangle,      p: {translateX: "0%"}, o: {duration: 300}},
				{e: wrapper,       p: {translateX: 0},    o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: backer,        p: {translateX: 0},    o: {display: "block", duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			];
		}
		else {
			sequence = [
				{e: questions, p: {opacity: 1},       o: {duration: 0}},
				{e: backer,    p: {opacity: 1},       o: {duration: 0}},
				{e: triangle,  p: {translateX: "0%"}, o: {duration: 300}},
				{e: wrapper,   p: {translateX: 0},    o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: backer,    p: {translateX: 0},    o: {display: "block", duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			];
		}

		$.Velocity.RunSequence(sequence);
	});

	$('#username-and-button button').on('click', function(e) {
		e.preventDefault();
		url = $('#username-and-button form').attr('action');
		clicked = $(this);
		count = $('#followers-count span');

		if (window.innerWidth < 900) {
			if (clicked.text() == "Following") {
	            sequence = [
	                {e: clicked, p: {scaleX: 1.15, scaleY: 1.15},                   o: {duration: 150}},
	                {e: clicked, p: {scaleX: 1, scaleY: 1},                         o: {duration: 150, complete: function() {
	                	clicked.text("Follow");
	                	clicked.removeClass("active");
	                }}},
	            ];
	        }
	        else {	
	            sequence = [
	                {e: clicked, p: {scaleX: 1.15, scaleY: 1.15},                   o: {duration: 150}},
	                {e: clicked, p: {scaleX: 1, scaleY: 1},                         o: {duration: 150, complete: function() {
	                	clicked.text("Following");
	                	clicked.addClass("active");
	                }}},
	            ];
	        }

	        $.Velocity.RunSequence(sequence);
	    }

		$.post(url, {_xsrf: getCookie('_xsrf')}, function(data) {
			if (data.redirect) {
				window.location.href = data.redirect;
			}
			else {
				count.text(data.followers);
				$('#username-and-button button').text(data.display_text);

				if (window.innerWidth < 900) {
					if (data.display_text == 'Follow') {
						$('#username-and-button button').removeClass("active");
					}
					else {
						$('#username-and-button button').addClass("active");
					}
				}
				else {
					if (data.display_text == 'Follow') {
						$('#username-and-button button').removeClass("active");
					}
					else {
						$('#username-and-button button').addClass("active");
					}
				}
			}
		});
	});

	var resizeTimer;
	$(window).resize(function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			$('.user img, .user-relationship-overlay').css({"height": $('.user img').eq(0).width() + 'px'});
		}, 200);
	});
});

function getFollowers(url) {
	if (!$('#follower-wrapper').length) {
		$.get(url, function(data) {
			if (!$('#following-wrapper').length) {
				$('#misc').append(data);
				user_img = $('.user img');
				overlay  = $('.user-relationship-overlay');
				backer   = $('#misc .backer');
				wrapper  = $('#follower-wrapper');
				question = $('.profile-questions');

				sequence = [
					{e: user_img, p: {height: user_img.width()}, o: {duration: 0}},
					{e: overlay,  p: {height: user_img.width()}, o: {duration: 0}},
					{e: backer,   p: {opacity: 1},               o: {duration: 0}},
					{e: backer,   p: {translateX: "100%"},       o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: wrapper,  p: {translateX: "100%"},       o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
					{e: backer,   p: {opacity: 0},               o: {duration: 0}},
					{e: question, p: {opacity: 0},               o: {duration: 0}}
				];

				$.Velocity.RunSequence(sequence);
			}
			else {
				$('#misc').append(data);
				user_img = $('.user img');
				overlay  = $('.user-relationship-overlay');
				backer   = $('#misc .backer');
				wrapper  = $('#follower-wrapper');
				other    = $('#following-wrapper');
				question = $('.profile-questions');
				tab_bar  = $('#mobile-tab-bar-wrapper');
				z_index  = parseInt($('#following-wrapper').css("z-index"));

				sequence = [
					{e: user_img, p: {height: user_img.width()}, o: {duration: 0}},
					{e: overlay,  p: {height: user_img.width()}, o: {duration: 0}},
					{e: tab_bar,  p: {"z-index": z_index + 3},   o: {duration: 0}},
					{e: wrapper,  p: {"z-index": z_index + 2},   o: {duration: 0}},
					{e: backer,   p: {"z-index": z_index + 1},   o: {duration: 0}},
					{e: backer,   p: {opacity: 1},               o: {duration: 0}},
					{e: backer,   p: {translateX: "100%"},       o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: wrapper,  p: {translateX: "100%"},       o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
					{e: backer,   p: {opacity: 0},               o: {duration: 0}},
					{e: question, p: {opacity: 0},               o: {duration: 0}}
				];

				$.Velocity.RunSequence(sequence);
			}
		});
	}
	else if ($('#following-wrapper').css("z-index") >= $('#follower-wrapper').css("z-index")) {
		backer  = $('#misc .backer');
		wrapper = $('#follower-wrapper');
		other    = $('#following-wrapper');
		question = $('.profile-questions');
		tab_bar = $('#mobile-tab-bar-wrapper');
		z_index = parseInt($('#following-wrapper').css("z-index"));

		sequence = [
			{e: tab_bar,  p: {"z-index": z_index + 3},                o: {duration: 0}},
			{e: wrapper,  p: {translateX: 0, "z-index": z_index + 2}, o: {duration: 0}},
			{e: backer,   p: {translateX: 0, "z-index": z_index + 1}, o: {duration: 0}},
			{e: backer,   p: {opacity: 1},                            o: {duration: 0}},
			{e: backer,   p: {translateX: "100%"},                    o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
			{e: wrapper,  p: {translateX: "100%"},                    o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: backer,   p: {opacity: 0},                            o: {duration: 0}},
			{e: question, p: {opacity: 0},                            o: {duration: 0}}
		];

		$.Velocity.RunSequence(sequence);
	}
	else {
		backer  = $('#misc .backer');
		wrapper = $('#follower-wrapper');
		question = $('.profile-questions');
		tab_bar = $('#mobile-tab-bar-wrapper');
		z_index = parseInt(wrapper.css("z-index"));

		sequence = [
			{e: tab_bar,  p: {"z-index": z_index + 3}, o: {duration: 0}},
			{e: wrapper,  p: {"z-index": z_index + 2}, o: {duration: 0}},
			{e: backer,   p: {"z-index": z_index + 1}, o: {duration: 0}},
			{e: backer,   p: {opacity: 1},             o: {duration: 0}},
			{e: backer,   p: {translateX: "100%"},     o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
			{e: wrapper,  p: {translateX: "100%"},     o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: backer,   p: {opacity: 0},             o: {duration: 0}},
			{e: question, p: {opacity: 0},             o: {duration: 0}}
		];

		$.Velocity.RunSequence(sequence);
	}
}

function getFollowing(url) {
	if (!$('#following-wrapper').length) {
		$.get(url, function(data) {
			if (!$('#follower-wrapper').length) {
				$('#misc').append(data);
				user_img = $('.user img');
				overlay  = $('.user-relationship-overlay');
				backer   = $('#misc .backer');
				wrapper  = $('#following-wrapper');
				question = $('.profile-questions');

				sequence = [
					{e: user_img, p: {height: user_img.width()}, o: {duration: 0}},
					{e: overlay,  p: {height: user_img.width()}, o: {duration: 0}},
					{e: backer,   p: {opacity: 1},               o: {duration: 0}},
					{e: backer,   p: {translateX: "100%"},       o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: wrapper,  p: {translateX: "100%"},       o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
					{e: backer,   p: {opacity: 0},               o: {duration: 0}},
					{e: question, p: {opacity: 0},               o: {duration: 0}}
				];

				$.Velocity.RunSequence(sequence);
			}
			else {
				$('#misc').append(data);
				user_img = $('.user img');
				overlay  = $('.user-relationship-overlay');
				backer   = $('#misc .backer');
				question = $('.profile-questions');
				other    = $('#follower-wrapper');
				wrapper  = $('#following-wrapper');
				tab_bar  = $('#mobile-tab-bar-wrapper');
				z_index  = parseInt($('#follower-wrapper').css("z-index"));

				sequence = [
					{e: user_img, p: {height: user_img.width()}, o: {duration: 0}},
					{e: overlay,  p: {height: user_img.width()}, o: {duration: 0}},
					{e: tab_bar,  p: {"z-index": z_index + 3},   o: {duration: 0}},
					{e: wrapper,  p: {"z-index": z_index + 2},   o: {duration: 0}},
					{e: backer,   p: {"z-index": z_index + 1},   o: {duration: 0}},
					{e: backer,   p: {opacity: 1},               o: {duration: 0}},
					{e: backer,   p: {translateX: "100%"},       o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: wrapper,  p: {translateX: "100%"},       o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
					{e: backer,   p: {opacity: 0},               o: {duration: 0}},
					{e: question, p: {opacity: 0},               o: {duration: 0}}
				];

				$.Velocity.RunSequence(sequence);
			}
		});
	}
	else if ($('#follower-wrapper').css("z-index") >= $('#following-wrapper').css("z-index")) {
		backer   = $('#misc .backer');
		wrapper  = $('#following-wrapper');
		other    = $('#follower-wrapper');
		question = $('.profile-questions');
		tab_bar  = $('#mobile-tab-bar-wrapper');
		z_index  = parseInt($('#follower-wrapper').css("z-index"));

		sequence = [
			{e: tab_bar,  p: {"z-index": z_index + 3},                o: {duration: 0}},
			{e: wrapper,  p: {translateX: 0, "z-index": z_index + 2}, o: {duration: 0}},
			{e: backer,   p: {translateX: 0, "z-index": z_index + 1}, o: {duration: 0}},
			{e: backer,   p: {opacity: 1},                            o: {duration: 0}},
			{e: backer,   p: {translateX: "100%"},                    o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
			{e: wrapper,  p: {translateX: "100%"},                    o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: backer,   p: {opacity: 0},                            o: {duration: 0}},
			{e: question, p: {opacity: 0},                            o: {duration: 0}}
		];

		$.Velocity.RunSequence(sequence);
	}
	else {
		backer   = $('#misc .backer');
		wrapper  = $('#following-wrapper');
		question = $('.profile-questions');
		tab_bar  = $('#mobile-tab-bar-wrapper');
		z_index  = parseInt(wrapper.css("z-index"));

		sequence = [
			{e: tab_bar,  p: {"z-index": z_index + 3}, o: {duration: 0}},
			{e: wrapper,  p: {"z-index": z_index + 2}, o: {duration: 0}},
			{e: backer,   p: {"z-index": z_index + 1}, o: {duration: 0}},
			{e: backer,   p: {opacity: 1},             o: {duration: 0}},
			{e: backer,   p: {translateX: "100%"},     o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
			{e: wrapper,  p: {translateX: "100%"},     o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: backer,   p: {opacity: 0},             o: {duration: 0}},
			{e: question, p: {opacity: 0},             o: {duration: 0}}
		];

		$.Velocity.RunSequence(sequence);
	}
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}