$(function() {
	var scroll_pos;
	$('.comment-count').on('click', function() {
		var question_id = $(this).parents('.question-wrapper').attr('id');
		var svg = $(this).find('.svg-image');

		$.get('/comments/' + question_id, function(data) {
			scroll_pos = $('body').scrollTop();
			$('#off-canvas-comments').html(data);
			$('#off-canvas-comments').prepend("<div id='close-comments'><div><svg fill='#ffffff' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/><path d='M0 0h24v24H0z' fill='none'/></svg></div><div>Comments</div></div>");
			$('#close-comments div:first-of-type').on('click', function() {
				$('main').css({"display": "block"});
				$('body').scrollTop(scroll_pos);

				comments = $('#off-canvas-comments');
				backer   = $('#off-canvas-comments-backer');

				sequence = [
					{e: comments, p: {translateY: 0}, o: {display: "none", duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
					{e: backer,   p: {translateY: 0}, o: {display: "none", duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
				];

				$.Velocity.RunSequence(sequence);
			});

			$('.all-comments').scroll(function() {
				var all_comments = document.getElementsByClassName("all-comments")[0];
				var top = all_comments.scrollTop, totalScroll = all_comments.scrollHeight, currentScroll = top + all_comments.offsetHeight;
		        if (top === 0) {
		            all_comments.scrollTop = 1;
		        } else if (currentScroll === totalScroll) {
		            all_comments.scrollTop = top - 1;
		        }
		    });

			jQuery.fn.preventDoubleSubmission = function() {
		        $(this).on('submit', function(e) {
		            var $form = $(this);

		            if ($form.data('submitted') === true) {
		                e.preventDefault();
		            }
		            else {
		                e.preventDefault();

		                var question_id = $('.comment-form form').attr('action').split('/')[2];
		                var comment_val = $('.comment-form input').eq(1).val();

		                if (comment_val) {
		                    $form.data('submitted', true);
		                    $.post('/comments/' + question_id, {_xsrf: getCookie('_xsrf'), comment: comment_val}, function(data) {
		                        if (data.redirect) {
		                            window.location.href = data.redirect;
		                        }
		                        else {
		                            data.replacement = data.replacement.slice(106, -387);
		                            $('.all-comments').replaceWith(data.replacement);
		                            $('.comment-form input').eq(1).val('');
		                            $('.all-comments').scrollTop($('.all-comments')[0].scrollHeight);
		                            $('#' + question_id).find('.comment-count .count-text').text(data.count);
		                            $form.data('submitted', false);
		                        }
		                    });
		                }
		            }
		        });

		        return this;
		    }

		    $('.comment-form form').preventDoubleSubmission();
		    
		    $('.comment-form img').on('click', function() {
		        $('.comment-form form').submit();
		    });

		    if ($(window).width() < 1200) {
		    	main     = $('main');
		    	comments = $('#off-canvas-comments').css({"display": "block"});
		    	backer   = $('#off-canvas-comments-backer');
		    	$('.all-comments').scrollTop(1);

		    	sequence = [
		    		{e: backer,   p: {translateY: "-100%"}, o: {display: "block", duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
		    		{e: comments, p: {translateY: "-100%"}, o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
		    		{e: main,     p: {opacity: 1},          o: {display: "none", duration: 0}}
		    	];

		    	$.Velocity.RunSequence(sequence);
			}
			else {
		    	comments = $('#off-canvas-comments').css({"display": "block"});
		    	backer   = $('#off-canvas-comments-backer');
		    	overlay  = $('#content-overlay').css({"z-index": 40});
		    	$('.all-comments').scrollTop(1);
		    	$('input[name="comment"]').focus();

		    	sequence = [
		    		{e: backer,   p: {translateY: "-100%"}, o: {display: "block", duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
		    		{e: comments, p: {translateY: "-100%"}, o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
		    		{e: overlay,  p: {opacity: 0.5},        o: {duration: 200}}
		    	];

		    	$.Velocity.RunSequence(sequence);
			}
		});
	});

	$('#off-canvas-question-form input').on('focusin', function() {
		if ($(window).width() < 1200) {
			$('#submit-question-button').velocity({translateY: 46}, 0);
		}
	});

	$('#off-canvas-question-form input').on('focusout', function() {
		if ($(window).width() < 1200) {
			$('#submit-question-button').velocity({translateY: 0}, 0);
		}
	});

	$('#content-overlay').on('click', function() {
		comments = $('#off-canvas-comments');
		backer   = $('#off-canvas-comments-backer');
		overlay  = $('#content-overlay');

		sequence = [
			{e: comments, p: {translateY: 0},  o: {display: "none", duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
			{e: backer,   p: {translateY: 0},  o: {display: "none", duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: overlay,  p: {opacity: 0},     o: {duration: 200}},
			{e: overlay,  p: {"z-index": -10}, o: {duration: 0}}
		];

		$.Velocity.RunSequence(sequence);
	});

	$('#follow-topic-button').on('click', function(e) {
		e.preventDefault();
		var url = $('#follow-topic-button').attr('formaction');

		$.post(url, {_xsrf: getCookie('_xsrf')}, function(data) {
			$('#topic-follower-count span').text(data.count);
			if (data.following) {
				$('#follow-topic-button').addClass('active').text('Following');
				$('#topics ul').append('<a href="/topics/' + data.name + '"><li class="active">#' + data.name + '</li></a>');
			}
			else {
				$('#follow-topic-button').removeClass('active').text('Follow');
				$('#topics .active').parent().remove();
			}
		});
	});

	$('#topic-follower-count').on('click', function() {
		var topic = $('#topic-title').text().substring(1);
		var url   = '/topics/' + topic + '/get_followers';
		$.get(url, function(data) {
			$('#relation-wrapper').remove();
			$('#main-content-title').append(data);
			$('.user img').css({"height": $('.user img').eq(0).width() + 'px'});
		});
	});
});

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}