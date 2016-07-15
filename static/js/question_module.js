$(function() {
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