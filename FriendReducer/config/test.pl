use File::Spec;
use File::Basename qw(dirname);
my $basedir = File::Spec->rel2abs(File::Spec->catdir(dirname(__FILE__), '..'));
my $dbpath;
if ( -d '/home/dotcloud/') {
    $dbpath = "/home/dotcloud/test.db";
} else {
    $dbpath = File::Spec->catfile($basedir, 'db', 'test.db');
}
+{
    'DBI' => [
        "dbi:SQLite:dbname=$dbpath",
        '',
        '',
        +{
            sqlite_unicode => 1,
        }
    ],
    'Auth' => +{
        'Twitter' => +{
            consumer_key    => 'dummy',
            consumer_secret => 'dummy',
        },
    },
};
