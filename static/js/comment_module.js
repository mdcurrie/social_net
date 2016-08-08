$(function() {
    $('.all-comments').animate({scrollTop: $(document).height()}, 1500);

    $('.comment-form form').on('submit', function(e) {
        e.preventDefault();
        var question_id  = $('.comment-form form').attr('action').split('/')[2];
        var comment_val  = $('.comment-form input').eq(0).val();
        $.get('/comments/' + question_id, {comment: comment_val}, function(data) {
            data = data.slice(107, -290);
            $('.all-comments').replaceWith(data);
            $('.comment-form input').val('');
            $('.all-comments').scrollTop($('.all-comments')[0].scrollHeight);
            $('.comment-count span').text($('.comment').size());
            $('.comment-count .svg-image').addClass('svg-active');
        });
    });

    $('.comment-form img').on('click', function() {
        var question_id  = $('.comment-form form').attr('action').split('/')[2];
        var comment_val  = $('.comment-form input').eq(0).val();
        $.get('/comments/' + question_id, {comment: comment_val}, function(data) {
            data = data.slice(107, -290);
            $('.all-comments').replaceWith(data);
            $('.comment-form input').val('');
            $('.all-comments').scrollTop($('.all-comments')[0].scrollHeight);
            $('.comment-count span').text($('.comment').size());
            $('.comment-count .svg-image').addClass('svg-active');
        });
    });
});