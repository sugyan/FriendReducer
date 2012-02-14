use strict;
use warnings;
use utf8;
use Test::More;

use_ok $_ for qw(
    FriendReducer
    FriendReducer::Web
    FriendReducer::Web::Dispatcher
);

done_testing;
