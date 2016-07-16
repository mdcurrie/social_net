$(function() {
    $('.labels h4').on('click', function(e) {
        var question_id = $(this).parent().attr('class').split(' ')[1];
        var vote_index = $('.labels h4').index($(this));
        $.getJSON('/vote/' + question_id, {vote_index: vote_index}, function(data) {
            $('.labels h4').removeClass('active');
            $('.labels h4').eq(data.idx).addClass('active');
            $('.vote-count h4').text(data.votes + ' Votes');
        });
    });

    $('.favorite-count img').on('click', function(e) {
        var question_id = $(this).attr('class').split(' ')[0];
        var clicked = $(this);
        $.getJSON('/favorite/' + question_id, function(data) {
            if ($(clicked).hasClass('inactive')) {
                $(clicked).addClass('active');
                $(clicked).removeClass('inactive');
                $(clicked).siblings().addClass('inactive');
                $(clicked).siblings().removeClass('active');
            }
            else {
                $(clicked).addClass('inactive');
                $(clicked).removeClass('active');
                $(clicked).siblings().addClass('active');
                $(clicked).siblings().removeClass('inactive');
            }
        });
    });

    $('.share-count img').on('click', function(e) {
        var question_id = $(this).attr('class').split(' ')[0];
        var clicked = $(this);
        $.getJSON('/share/' + question_id, function(data) {
            if ($(clicked).hasClass('inactive')) {
                $(clicked).addClass('active');
                $(clicked).removeClass('inactive');
                $(clicked).siblings().addClass('inactive');
                $(clicked).siblings().removeClass('active');
            }
            else {
                $(clicked).addClass('inactive');
                $(clicked).removeClass('active');
                $(clicked).siblings().addClass('active');
                $(clicked).siblings().removeClass('inactive');
            }
        });
    });
});