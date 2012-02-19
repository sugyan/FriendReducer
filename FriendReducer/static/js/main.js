$(function () {
    var Reducer = function (data) {
        this.friends = data;
    };
    Reducer.prototype.judge = function () {
        var self = this;
        self.target = self.friends.pop();
        if (! self.target) {
            $('#main_content').text('finished!');
            return;
        }

        self.flag = true;
        var count = 40;
        var followed = $.inArray('followed_by', self.target.connections) !== -1;
        $('#screen_name').text('@' + self.target.screen_name);
        $('#name').text('(' + self.target.name + ')');
        $('#connection').text(
            followed
                ? ' is following you.'
                : ' is not following you.'
        ).css('color', followed ? 'green' : 'red');

        (function countdown () {
            if (! self.flag) {
                self.judge();
                return;
            }
            count--;
            $('#timer').text(Math.floor(count / 10) + '.' + count % 10);
            if (count === 0) {
                window.setTimeout(function () {
                    self.unfollow(self.target);
                    self.judge();
                }, 100);
            }
            else {
                window.setTimeout(function () {
                    countdown();
                }, 100);
            }
        }());
    };
    Reducer.prototype.unfollow = function (friend) {
        $.ajax({
            url: '/api/unfollow',
            type: 'POST',
            data: {
                csrf_token: $('input[name="csrf_token"]').val(),
                id: friend.id_str
            },
            success: function (data) {
                $('#logs').prepend(
                    $('<li>').text('unfollowed @' + data.screen_name + '.')
                );
                window.twttr.anywhere(function (T) {
                    T('#logs').linkifyUsers({ className: 'blank' });
                    $('#logs .blank').attr('target', '_blank');
                });
            }
        });
    };

    $('#signout').click(function () {
        $('#signout_form').submit();
    });
    $('#start').click(function (e) {
        $(this).hide();
        $.ajax({
            url: '/api/friends',
            success: function (data) {
                $('#main_content').show();
                var reducer = new Reducer(data);
                $('#buttons button').click(function () {
                    reducer.flag = false;
                });
                $('#unfollow').click(function () {
                    reducer.unfollow(reducer.target);
                });
                reducer.judge();
            }
        });
    });
});
