package FriendReducer::Web::Dispatcher;
use strict;
use warnings;
use utf8;
use Amon2::Web::Dispatcher::Lite;
use List::Util 'shuffle';
use Net::Twitter::Lite;

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
    if (my $auth = $c->session->get('auth')) {
        my $ntl = Net::Twitter::Lite->new(
            consumer_key        => $c->config->{Auth}{Twitter}{consumer_key},
            consumer_secret     => $c->config->{Auth}{Twitter}{consumer_secret},
            access_token        => $auth->{access_token},
            access_token_secret => $auth->{access_token_secret},
        );
        my @ids = shuffle @{ $ntl->friends_ids->{ids} };
        @ids = splice @ids, 0, 100;
        $data = $ntl->lookup_friendships({
            user_id => join ',', @ids,
        });
    }
    $c->render_json($data);
};

1;
