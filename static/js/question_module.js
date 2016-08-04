$(function() {
    $('.labels h4').on('click', function() {
        var question_id = $(this).parent().attr('class').split(' ')[1];
        var vote_index  = $(this).prevAll().length;
        var q = $(this);
        $.getJSON('/vote/' + question_id, {vote_index: vote_index}, function(data) {
            q.siblings().removeClass('active');
            q.addClass('active');
            q.parents('.chart').siblings('.asker-info').find('.vote-count h4').text(data.votes + ' Votes');
        });
    });

    $('.favorite-count .svg-image').on('click', function() {
        var question_id = $(this).attr('class').split(' ')[1];
        var clicked = $(this);
        $.getJSON('/favorite_or_share/' + question_id, {action: "favorite"}, function(data) {
            if (data.favorite) {
                clicked.addClass('svg-active');
            }
            else {
                clicked.removeClass('svg-active');
            }
            clicked.parents('.favorite-count').children('span').text(data.count);
        });
    });

    $('.share-count .svg-image').on('click', function() {
        var question_id = $(this).attr('class').split(' ')[1];
        var clicked = $(this);
        $.getJSON('/favorite_or_share/' + question_id, {action: "share"}, function(data) {
            if (data.share) {
                clicked.addClass('svg-active');
            }
            else {
                clicked.removeClass('svg-active');
            }
            clicked.parents('.share-count').children('span').text(data.count);
        });
    });
});