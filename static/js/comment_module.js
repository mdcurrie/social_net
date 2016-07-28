$(function() { 
    $('form').on('submit', function(e) {
        e.preventDefault();
        var question_id  = window.location.href.split("/").pop();
        var comment_val = $('input').eq(0).val();
        $.get('/comments/' + question_id, {comment: comment_val}, function(data) {
            data = data.slice(43, -7)
            $('.all-comments').replaceWith(data);
            $('form').eq(0).remove();
            $('input').val('');
            $('body').animate({scrollTop: $(document).height()}, 'slow');
            $('.comment-count-text').text($('.comment').size());
            $('.comment-count .svg-image').find('path').css({"fill": "#693ca1"});
        });
    });
});