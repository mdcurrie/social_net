$(function() {
    $('.all-comments').animate({scrollTop: $('.all-comments')[0].scrollHeight}, 600);

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
                            data.replacement = data.replacement.slice(106, -465);
                            $('.all-comments').replaceWith(data.replacement);
                            $('.comment-form input').eq(1).val('');
                            if (window.innerWidth < 900) {
                                $('body').scrollTop($('body')[0].scrollHeight);
                            }
                            else {
                                $('.all-comments').scrollTop($('.all-comments')[0].scrollHeight);
                            }
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
    
    $('#comment-img-wrapper').on('click', function() {
        if (window.innerWidth < 900) {
            wrapper = $(this);
            sequence = [
                {e: wrapper, p: {scaleX: 1.35, scaleY: 1.35}, o: {duration: 150}},
                {e: wrapper, p: {scaleX: 1, scaleY: 1},       o: {duration: 150}}
            ];
            $.Velocity.RunSequence(sequence);
        }
        $('.comment-form form').submit();
    });
});

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}