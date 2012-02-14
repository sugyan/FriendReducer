use strict;
use warnings;
use Test::More;
use Test::Requires 'YAML::Tiny';
eval { YAML::Tiny->read('dotcloud.yml') };
ok(!$@, 'valid yaml file') or diag $@;
done_testing;
