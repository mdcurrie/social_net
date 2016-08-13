$(function() {
    $('.all-comments').animate({scrollTop: $('.all-comments')[0].scrollHeight}, 1500);
    
    $('.comment-form form').on('submit', function(e) {
        e.preventDefault();
        submitForm();
    });
    $('.comment-form img').on('click', function() {
        submitForm();
    });
});

function submitForm() {
    var question_id = $('.comment-form form').attr('action').split('/')[2];
    var comment_val = $('.comment-form input').eq(1).val();
    if (comment_val) {
        $.post('/comments/' + question_id, {_xsrf: getCookie('_xsrf'), comment: comment_val}, function(data) {
            data = data.slice(106, -387);
            $('.all-comments').replaceWith(data);
            $('.comment-form input').eq(1).val('');
            $('.all-comments').scrollTop($('.all-comments')[0].scrollHeight);
            $('#' + question_id).find('.comment-count .count-text').text($('.comment').size());
            $('#' + question_id).find('.comment-count .icon-indicator').addClass('active');
        });
    }
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}