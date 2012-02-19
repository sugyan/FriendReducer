package FriendReducer::Web::Dispatcher;
use strict;
use warnings;
use utf8;
use Amon2::Web::Dispatcher::Lite;
use List::Util 'shuffle';

any '/' => sub {
    my ($c) = @_;
    $c->render('index.tt');
};

post '/account/logout' => sub {
    my ($c) = @_;
    $c->session->expire();
    $c->redirect('/');
};

get '/api/friends' => sub {
    my ($c) = @_;
    my $data = [];
    if (my $ntl = $c->auth) {
        my @ids = shuffle @{ $ntl->friends_ids->{ids} };
        @ids = splice @ids, 0, 100;
        $data = $ntl->lookup_friendships({
            user_id => join ',', @ids,
        });
    }
    $c->render_json($data);
};

post '/api/unfollow' => sub {
    my ($c) = @_;
    if (my $ntl = $c->auth) {
        my $id = $c->req->param('id');
        $c->render_json($ntl->unfollow($id));
    }
    else {
        $c->create_response(401, [], 'Unauthorized');
    }
};

1;
