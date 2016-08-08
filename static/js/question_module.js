$(function() {
    $('.poll-answer').on('click', function() {
        var question_id = $(this).parent().attr('class').split(' ')[1];
        var vote_index  = $(this).prevAll().length;
        var q = $(this);
        $.getJSON('/vote/' + question_id, {vote_index: vote_index}, function(data) {
            q.parent().find('.poll-percentage-wrapper').removeClass('active');
            q.find('.poll-percentage-wrapper').addClass('active');
            q.parents('#question-wrapper').find('.vote-count').text(data.votes + ' Votes');
            for (var i=0; i < data.percentages.length; i++) {
                $('#question-wrapper').find('.poll-percentage').eq(i).text(parseInt(data.percentages[i]) + '%');
                $('#question-wrapper').find('.bar-wrapper2').eq(i).css('width', data.percentages[i] + '%');
            }
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