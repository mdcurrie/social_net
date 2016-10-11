$(function() {
    $('.poll-answer').on('click', function() {
        var question_id = $(this).parent().attr('class').split(' ')[1];
        var vote_index  = $(this).prevAll().length;
        var q = $(this);

        $.post('/vote/' + question_id, {_xsrf: getCookie('_xsrf'), vote_index: vote_index}, function(data) {
            if (data.redirect) {
                window.location.href = data.redirect;
            }
            else {
                q.parent().find('.poll-percentage-wrapper').removeClass('active');
                if (!data.removed_vote) {
                    q.find('.poll-percentage-wrapper').addClass('active');
                }
                q.parents('.question-wrapper').find('.vote-count').text(data.votes + ' Votes');
                for (var i=0; i < data.percentages.length; i++) {
                    q.parents('.question-wrapper').find('.poll-percentage').eq(i).text(parseInt(data.percentages[i]) + '%');
                    q.parents('.question-wrapper').find('.bar-wrapper2').eq(i).css('width', data.percentages[i] + '%');
                }
            }
        });
    });

    $('.favorite-count').on('click', function() {
        var question_id = $(this).find('.svg-image').attr('class').split(' ')[1];
        var clicked = $(this).find('.svg-image');

        $.post('/favorite_or_share/' + question_id, {_xsrf: getCookie('_xsrf'), action: "favorite"}, function(data) {
            if (data.redirect) {
                window.location.href = data.redirect;
            }
            else {
                if (data.favorite) {
                    clicked.find('path').css({"fill": "#e64c65"});
                }
                else {
                    clicked.find('path').css({"fill": "white"});
                }
                clicked.parents('.favorite-count').children('.count-text').text(data.count);
            }
        });
    });
});

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}