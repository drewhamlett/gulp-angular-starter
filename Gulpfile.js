var gulp = require('gulp');
var runSequence = require('run-sequence');
var karma = require('karma').server;
var _ = require('lodash');
var es = require('event-stream');

var $ = require('gulp-load-plugins')({
    camelize: true
});

var config = {
    dist: 'build/',
    appName: 'app'
};

gulp.task('usemin', function () {
    return gulp.src('./app/index.html')
        .pipe($.spa.html({
            assetsDir: 'app/',
            pipelines: {
                main: function (files) {
                    return files.pipe($.minifyHtml({
                        quotes: true
                    }));
                },
                js: function (files) {

                    var jsFiles = function () {
                        return gulp.src('./app/assets/js/**/*.js')
                            .pipe($.ngmin())
                    };

                    var angularTemplates = function () {
                        return gulp.src('./app/assets/partials/**/*.html')
                            .pipe($.minifyHtml({
                                quotes: true
                            }))
                            .pipe($.angularTemplatecache({
                                root: 'assets/partials/',
                                module: config.appName // has to be the name of angular app
                            }));
                    };

                    return es.concat(jsFiles(), angularTemplates())
                        .pipe($.concat('app.js'))
                        .pipe($.uglify())
                        .pipe($.rev());

                },
                css: function (files) {
                    return files
                        .pipe($.minifyCss())
                        .pipe($.concat('app.css'))
                        .pipe($.rev());
                },
                vendor: function (files) {
                    return files
                        .pipe($.concat('vendor.js'))
                        .pipe($.uglify())
                        .pipe($.rev());
                }
            }
        }))
        .pipe(gulp.dest('./build'));
});


// Optional Manifest file
// gulp.task('manifest', function () {
//     gulp.src(['build/*'])
//         .pipe($.manifest({
//             hash: true,
//             preferOnline: true,
//             network: ['http://*', 'https://*', '*'],
//             filename: 'app.manifest',
//             exclude: ['app.manifest', 'index.html']
//         }))
//         .pipe(gulp.dest('build'));
// });

gulp.task('connect', function () {
    $.connect.server({
        root: './app',
        livereload: true
    });
});

gulp.task('minify-html', function () {
    return gulp.src(config.dist + 'index.html')
        .pipe($.minifyHtml({
            empty: true,
            quotes: true
        }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('html', function () {
    gulp.src('./app/*.html')
        .pipe($.connect.reload());
});

gulp.task('scripts', function () {
    return gulp.src('app/assets/js/*.js')
        .pipe($.connect.reload());
});

gulp.task('css', function () {
    return gulp.src('app/assets/css/*.css')
        .pipe($.connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./app/*.html', './app/assets/partials/**/*.html'], ['html']);
    gulp.watch(['./app/assets/js/**/*.js'], ['scripts']);
    gulp.watch(['./app/assets/css/**/*.css'], ['css']);
});

gulp.task('clean', function () {
    return gulp.src(config.dist, {
        read: false
    }).pipe($.clean());
});

gulp.task('bower', function () {

    var filter = $.filter(['**/*.js']);

    var config = {
        starttag: 'files: [',
        endtag: ']',
        addRootSlash: false,
        transform: function (filepath, file, i, length) {
            return '  "' + filepath + '"' + (i + 1 < length ? ', \n' : '');
        }
    };

    gulp.src('./test/karma-common.conf.js')
        .pipe(
            $.inject(
                $.bowerFiles({
                    read: false
                }).pipe(filter),
                config
            ))
        .pipe(gulp.dest('./test'));
});

var karmaCommonConf = require('./test/karma-common.conf.js');
var testFiles = karmaCommonConf.files.concat(
    [
        'app/assets/vendor/angular-mocks/angular-mocks.js',
        'app/assets/js/app.js',
        'app/assets/js/**/*.js',
        'test/spec/**/*.js'
    ]
);

karmaCommonConf.files = testFiles;

// Run `gulp bower` to inject bower dependencies for testing

gulp.task('test', function (done) {
    karma.start(_.assign({}, karmaCommonConf, {
        singleRun: true
    }), done);
});

gulp.task('tdd', function (done) {
    karma.start(karmaCommonConf, done);
});

gulp.task('build', function () {

    runSequence(
        'clean',
        'usemin',
        function () {
            $.util.log('Build complete');
        });
});

gulp.task('default', ['connect', 'watch']);
gulp.task('serve', ['connect', 'watch']);