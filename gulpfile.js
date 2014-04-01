// Gulp and utils
var gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    clean        = require('gulp-clean'),
    size         = require('gulp-size'),
    rename       = require('gulp-rename'),
    notify       = require('gulp-notify'),
    watch        = require('gulp-watch'),
    connect      = require('gulp-connect'),
    livereload   = require('gulp-livereload'),
    lr           = require('tiny-lr'),
    server       = lr(),
    // Scripts [coffee, js]
    coffee       = require('gulp-coffee'),
    coffeelint   = require('gulp-coffeelint'),
    uglify       = require('gulp-uglify'),
    __ports      = {
        'server': 1337,
        'livereload': 35731
    };

// Sripts
gulp.task('scripts', function () {
    return gulp.src(['source/v2/coffee/{,*/}*.{coffee,coffee.md}', '!source/{,*/}*.min*'])
        .pipe(coffee({
            bare: true
        }))
        .on('error', gutil.log)
        .pipe(coffeelint())
        .on('error', gutil.log)
        .pipe(coffeelint.reporter())
        .on('error', gutil.log)
        .pipe(size())
        .pipe(gulp.dest('source/v2/js'))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(size())
        .pipe(gulp.dest('source/v2/js'))
        .pipe(livereload(server));
});

// Connect & livereload
gulp.task('connect', connect.server({
    root: __dirname + '/',
    port: __ports.server,
    livereload: true
}));

// Watch
gulp.task('watch', function () {
    // Listen on port 35730
    server.listen(__ports.livereload, function (error) {
        if (error) {
            return console.error(error);
        }

        // Watch .coffee files
        gulp.watch('source/{,*/}*.{coffee,coffee.md}', ['scripts']);
    });
});

// Dev
gulp.task('serve', ['scripts'], function () {
    gulp.start('connect', 'watch');
});

gulp.task('build', ['scripts'], function () {
    return gulp.src('source/v2/js/colormix-2.0.0.min.js')
        .pipe(gulp.dest('build'));
});

// Default task
gulp.task('default', ['serve']);
