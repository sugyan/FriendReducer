$(function () {
    var Reducer = function (data) {
        this.friends = data;
    };
    Reducer.prototype.judge = function () {
        var self = this;
        var friend = self.friends.pop();
        if (! friend) {
            $('#main_content').text('finished!');
            return;
        }

        self.flag = true;
        var count = 40;
        var followed = $.inArray('followed_by', friend.connections) !== -1;
        $('#screen_name').text('@' + friend.screen_name);
        $('#name').text('(' + friend.name + ')');
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
                    // TODO: unfollow
                    console.log('delete');
                });
                reducer.judge();
            }
        });
    });
});
