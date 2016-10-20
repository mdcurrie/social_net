$(function() {
	$('.comment-count').on('click', function() {
		var question_id = $(this).parents('.question-wrapper').attr('id');
		$.get('/comments/' + question_id, function(data) {
			$('#off-canvas-comments').html(data);
			$('#off-canvas-comments').prepend("<div id='close-comments'><div>&times</div></div>");
			$('#close-comments div').on('click', function() {
				$('main').css({"display": "initial"});
				$('#off-canvas-comments').transition({y: "100%"}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.015)');
				$('#off-canvas-comments-backer').transition({y: "100%"}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)');
			});

			if ($(window).width() >= 1200) {
				$('.all-comments').scrollTop($('.all-comments')[0].scrollHeight);
			}

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
		});

		if ($(window).width() < 1200) {
			$('#off-canvas-comments-backer').transition({y: 0}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.015)');
			$('#off-canvas-comments').transition({y: 0}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)', function() {
				$('.all-comments').scrollTop($('.all-comments')[0].scrollHeight);
				$('main').css({"display": "none"});
			});
		}
		else {
			$('#off-canvas-comments-backer').transition({y: 80}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.015)');
			$('#off-canvas-comments').transition({y: 80}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)', function() {
				$('#content-overlay').css({'z-index': 40});
				$('#content-overlay').transition({opacity: 0.5}, 200);
				$('input[name="comment"]').focus();
			});
		}
	});

	$('#content-overlay').on('click', function() {
		$('#off-canvas-comments').transition({y: "calc(100% + 80px)"}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.015)');
		$('#off-canvas-comments-backer').transition({y: "calc(100% + 80px)"}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)', function() {
			$('#content-overlay').transition({opacity: 0}, 200, function() {
				$('#content-overlay').css({'z-index': -10});
			});
		});
	});

/*	$('.question-image').hover(
		function() {
			$('#off-canvas-comments-backer').css({"will-change": "transform"});
			$('#off-canvas-comments').css({"will-change": "transform"});
		},
		function() {
			$('#off-canvas-comments-backer').css({"will-change": "initial"});
			$('#off-canvas-comments').css({"will-change": "initial"});
		}
	);

	$('#content-overlay').hover(
		function() {
			$('#off-canvas-comments-backer').css({"will-change": "transform"});
			$('#off-canvas-comments').css({"will-change": "transform"});
		},
		function() {
			$('#off-canvas-comments-backer').css({"will-change": "initial"});
			$('#off-canvas-comments').css({"will-change": "initial"});
		}
	);
*/
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