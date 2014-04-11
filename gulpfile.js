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
    // Styles [sass, css]
    sass         = require('gulp-ruby-sass'),
    minifycss    = require('gulp-minify-css'),
    csso         = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    // Scripts [coffee, js]
    coffee       = require('gulp-coffee'),
    coffeelint   = require('gulp-coffeelint'),
    uglify       = require('gulp-uglify'),
    __ports      = {
        'server': 1339,
        'livereload': 35730
    };

// Sripts
gulp.task('assets-scripts', function () {
    return gulp.src(['examples/landing/assets/coffee/{,*/}*.{coffee,coffee.md}', '!examples/landing/assets/coffee/{,*/}*.min*'])
        .pipe(coffee({
            bare: true
        }))
        .on('error', gutil.log)
        .pipe(coffeelint())
        .on('error', gutil.log)
        .pipe(coffeelint.reporter())
        .on('error', gutil.log)
        .pipe(size())
        .pipe(gulp.dest('examples/landing/assets/js'))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(size())
        .pipe(gulp.dest('examples/landing/assets/js'))
        .pipe(livereload(server));
});

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

// Styles
gulp.task('styles', function () {
    return gulp.src(['examples/landing/assets/sass/{,*/}*.{scss,sass}', '!examples/{,*/}*.min*', '!examples/landing/assets/sass/*_*.{scss,sass}'])
        .pipe(sass({
            style: 'expanded',
            quiet: true,
            trace: true
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('examples/landing/assets/css'))
        .pipe(autoprefixer('last 1 version'))
        .pipe(csso())
        .pipe(minifycss())
        .pipe(size())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('examples/landing/assets/css'))
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

        // Watch .coffee files
        gulp.watch('examples/landing/assets/coffee/{,*/}*.{coffee,coffee.md}', ['assets-scripts']);

        // Watch .sass files
        gulp.watch('examples/{,*/}*.{sass,scss}', ['styles']);
    });
});

// Dev
gulp.task('serve', ['scripts', 'assets-scripts', 'styles', 'connect'], function () {
    gulp.start('watch');
});

gulp.task('build', ['scripts', 'styles'], function () {
    gulp.src('source/v1/js/*.js').pipe(gulp.dest('build/v1'));
    return gulp.src('source/v2/js/*.js').pipe(gulp.dest('build/v2'));
});

// Default task
gulp.task('default', ['serve']);
