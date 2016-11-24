$(function() {
	$('#followers-count').on('click', function() {
		var url = $(this).attr('class');

		if (window.innerWidth < 900) {
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
					question = $('.profile-questions');

					sequence = [
						{e: user_img, p: {height: user_img.width()},   o: {duration: 0}},
						{e: overlay,  p: {height: user_img.width()},   o: {duration: 0}},
						{e: wrapper,  p: {backgroundColor: "#ffffff"}, o: {duration: 0}},
						{e: backer,   p: {translateX: "100%"},         o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
						{e: wrapper,  p: {translateX: "100%"},         o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
						{e: backer,   p: {opacity: 0},                 o: {duration: 0}},
						{e: question, p: {opacity: 0},                 o: {duration: 0}},
						{e: wrapper,  p: {backgroundColorAlpha: 0},    o: {duration: 0}}

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
						{e: user_img, p: {height: user_img.width()},              o: {duration: 0}},
						{e: overlay,  p: {height: user_img.width()},              o: {duration: 0}},
						{e: tab_bar,  p: {"z-index": z_index + 3},                o: {duration: 0}},
						{e: backer,   p: {visibility: "hidden"},                  o: {duration: 0}},
						{e: backer,   p: {translateX: 0, "z-index": z_index + 1}, o: {duration: 0}},
						{e: wrapper,  p: {"z-index": z_index + 2},                o: {duration: 0}},
						{e: backer,   p: {visibility: "visibile"},                o: {duration: 0}},
						{e: wrapper,  p: {opacity: 1},                            o: {duration: 0}},
						{e: wrapper,  p: {backgroundColor: "#ffffff"},  o: {duration: 0}},
						{e: backer,   p: {opacity: 1},                            o: {duration: 0}},
						{e: backer,   p: {translateX: "100%"},                    o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
						{e: wrapper,  p: {translateX: "100%"},                    o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
						{e: backer,   p: {opacity: 0},                 o: {duration: 0}},
						{e: question, p: {opacity: 0},                 o: {duration: 0}},
						{e: other,    p: {opacity: 0},                 o: {duration: 0}},
						{e: wrapper,  p: {backgroundColorAlpha: 0},    o: {duration: 0}}
					];

					$.Velocity.RunSequence(sequence);
				}
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
					{e: backer,   p: {visibility: "hidden"},                  o: {duration: 0}},
					{e: backer,   p: {translateX: 0, "z-index": z_index + 1}, o: {duration: 0}},
					{e: wrapper,  p: {translateX: 0, "z-index": z_index + 2}, o: {duration: 0}},
					{e: backer,   p: {visibility: "visibile"},                o: {duration: 0}},
					{e: wrapper,  p: {opacity: 1, backgroundColor: "#ffffff", backgroundColorAlpha: 1}, o: {duration: 0}},
					{e: backer,   p: {opacity: 1},                            o: {duration: 0}},
					{e: backer,   p: {translateX: "100%"},                    o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: wrapper,  p: {translateX: "100%"},                    o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
					{e: backer,   p: {opacity: 0},                 o: {duration: 0}},
					{e: question, p: {opacity: 0},                 o: {duration: 0}},
					{e: other,    p: {opacity: 0},                 o: {duration: 0}},
					{e: wrapper,  p: {backgroundColorAlpha: 0},    o: {duration: 0}}
				];

				$.Velocity.RunSequence(sequence);
			}
			else {
				backer  = $('#misc .backer');
				wrapper = $('#follower-wrapper');
				question = $('.profile-questions');
				tab_bar = $('#mobile-tab-bar-wrapper');
				z_index = parseInt($('#following-wrapper').css("z-index"));

				sequence = [
					{e: tab_bar,  p: {"z-index": z_index + 3}, o: {duration: 0}},
					{e: backer,   p: {"z-index": z_index + 1}, o: {duration: 0}},
					{e: wrapper,  p: {"z-index": z_index + 2}, o: {duration: 0}},
					{e: wrapper,  p: {opacity: 1, backgroundColor: "#ffffff", backgroundColorAlpha: 1}, o: {duration: 0}},
					{e: backer,   p: {opacity: 1},                            o: {duration: 0}},
					{e: backer,   p: {translateX: "100%"},     o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: wrapper,  p: {translateX: "100%"},     o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
					{e: backer,   p: {opacity: 0},                 o: {duration: 0}},
					{e: question, p: {opacity: 0},                 o: {duration: 0}},
					{e: wrapper,  p: {backgroundColorAlpha: 0},    o: {duration: 0}}
				];

				$.Velocity.RunSequence(sequence);
			}
		});
	});

	$('#following-count').on('click', function() {
		var url = $(this).attr('class');

		if (window.innerWidth < 900) {
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
					question = $('.profile-questions');

					sequence = [
						{e: user_img, p: {height: user_img.width()},   o: {duration: 0}},
						{e: overlay,  p: {height: user_img.width()},   o: {duration: 0}},
						{e: wrapper,  p: {backgroundColor: "#ffffff"}, o: {duration: 0}},
						{e: backer,   p: {translateX: "100%"},         o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
						{e: wrapper,  p: {translateX: "100%"},         o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
						{e: backer,   p: {opacity: 0},                 o: {duration: 0}},
						{e: question, p: {opacity: 0},                 o: {duration: 0}},
						{e: wrapper,  p: {backgroundColorAlpha: 0},    o: {duration: 0}}
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
						{e: user_img, p: {height: user_img.width()},              o: {duration: 0}},
						{e: overlay,  p: {height: user_img.width()},              o: {duration: 0}},
						{e: tab_bar,  p: {"z-index": z_index + 3},                o: {duration: 0}},
						{e: backer,   p: {visibility: "hidden"},                  o: {duration: 0}},
						{e: backer,   p: {translateX: 0, "z-index": z_index + 1}, o: {duration: 0}},
						{e: wrapper,  p: {"z-index": z_index + 2},                o: {duration: 0}},
						{e: backer,   p: {visibility: "visibile"},                o: {duration: 0}},
						{e: wrapper,  p: {opacity: 1, backgroundColor: "#ffffff", backgroundColorAlpha: 1}, o: {duration: 0}},
						{e: backer,   p: {opacity: 1},                            o: {duration: 0}},
						{e: backer,   p: {translateX: "100%"},                    o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
						{e: wrapper,  p: {translateX: "100%"},                    o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
						{e: backer,   p: {opacity: 0},                 o: {duration: 0}},
						{e: question, p: {opacity: 0},                 o: {duration: 0}},
						{e: other,    p: {opacity: 0},                 o: {duration: 0}},
						{e: wrapper,  p: {backgroundColorAlpha: 0},    o: {duration: 0}}
					];

					$.Velocity.RunSequence(sequence);
				}
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
					{e: backer,   p: {visibility: "hidden"},                  o: {duration: 0}},
					{e: backer,   p: {translateX: 0, "z-index": z_index + 1}, o: {duration: 0}},
					{e: wrapper,  p: {translateX: 0, "z-index": z_index + 2}, o: {duration: 0}},
					{e: backer,   p: {visibility: "visibile"},                o: {duration: 0}},
					{e: wrapper,  p: {opacity: 1, backgroundColor: "#ffffff", backgroundColorAlpha: 1}, o: {duration: 0}},
					{e: backer,   p: {opacity: 1},                            o: {duration: 0}},
					{e: backer,   p: {translateX: "100%"},                    o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: wrapper,  p: {translateX: "100%"},                    o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
					{e: backer,   p: {opacity: 0},                 o: {duration: 0}},
					{e: question, p: {opacity: 0},                 o: {duration: 0}},
					{e: other,    p: {opacity: 0},                 o: {duration: 0}},
					{e: wrapper,  p: {backgroundColorAlpha: 0},    o: {duration: 0}}
				];

				$.Velocity.RunSequence(sequence);
			}
			else {
				backer   = $('#misc .backer');
				wrapper  = $('#following-wrapper');
				question = $('.profile-questions');
				tab_bar  = $('#mobile-tab-bar-wrapper');
				z_index  = parseInt($('#follower-wrapper').css("z-index"));

				sequence = [
					{e: tab_bar,  p: {"z-index": z_index + 3}, o: {duration: 0}},
					{e: backer,   p: {"z-index": z_index + 1}, o: {duration: 0}},
					{e: wrapper,  p: {"z-index": z_index + 2}, o: {duration: 0}},
					{e: wrapper,  p: {opacity: 1, backgroundColor: "#ffffff", backgroundColorAlpha: 1}, o: {duration: 0}},
					{e: backer,   p: {opacity: 1},                            o: {duration: 0}},
					{e: backer,   p: {translateX: "100%"},     o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: wrapper,  p: {translateX: "100%"},     o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
					{e: backer,   p: {opacity: 0},                 o: {duration: 0}},
					{e: question, p: {opacity: 0},                 o: {duration: 0}},
					{e: wrapper,  p: {backgroundColorAlpha: 0},    o: {duration: 0}}
				];

				$.Velocity.RunSequence(sequence);
			}
		});
	});

	$('#question-count').on('click', function() {

		question = $('.profile-questions');

		if (window.innerWidth < 900) {
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
				{e: wrapper,       p: {backgroundColorAlpha: 1, backgroundColor: "#ffffff"}, o: {duration: 0}},
				{e: backer,        p: {opacity: 1},    o: {duration: 0}},
				{e: question,      p: {opacity: 1},    o: {duration: 0}},
				{e: wrapper,       p: {translateX: 0}, o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
				{e: backer,        p: {translateX: 0}, o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			];
		}
		else {
			sequence = [
				{e: wrapper,       p: {backgroundColorAlpha: 1, backgroundColor: "#ffffff"}, o: {duration: 0}},
				{e: backer,        p: {opacity: 1},    o: {duration: 0}},
				{e: question,      p: {opacity: 1},    o: {duration: 0}},
				{e: wrapper, p: {translateX: 0}, o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
				{e: backer,  p: {translateX: 0}, o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
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
			if (clicked.css("background-color") == "rgb(255, 255, 255)") {
				if (parseInt(count.text()) < 1000) {
					count.text(parseInt(count.text()) - 1);
				}
	            sequence = [
	                {e: clicked, p: {scaleX: 1.75, scaleY: 1.75},                   o: {duration: 100}},
	                {e: clicked, p: {scaleX: 1, scaleY: 1},                         o: {duration: 100}},
	                {e: clicked, p: {backgroundColor: "#2eb398", color: "#ffffff"}, o: {duration: 100, sequenceQueue: false}}
	            ];
	        }
	        else {
	        	if (parseInt(count.text()) < 1000) {
					count.text(parseInt(count.text()) + 1);
				}  	
	            sequence = [
	                {e: clicked, p: {scaleX: 1.75, scaleY: 1.75},                   o: {duration: 100}},
	                {e: clicked, p: {scaleX: 1, scaleY: 1},                         o: {duration: 100}},
	                {e: clicked, p: {backgroundColor: "#ffffff", color: "#2eb398"}, o: {duration: 100, sequenceQueue: false}}
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
						$('#username-and-button button').velocity({backgroundColor: "#2eb398", color: "#ffffff"}, 100).removeClass("active");
					}
					else {
						$('#username-and-button button').velocity({backgroundColor: "#ffffff", color: "#2eb398"}, 100).addClass("active");
					}
				}
				else {
					if (data.display_text == 'Follow') {
						$('#username-and-button button').velocity({backgroundColor: "#ffffff", color: "#2eb398"}, 100).removeClass("active");
					}
					else {
						$('#username-and-button button').velocity({backgroundColor: "#2eb398", color: "#ffffff"}, 100).addClass("active");
					}
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