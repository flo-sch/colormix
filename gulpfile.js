// Gulp and utils
var path            = require('path'),
    gulp            = require('gulp'),
    gutil           = require('gulp-util'),
    rename          = require('gulp-rename'),
    notify          = require('gulp-notify'),
    pump            = require('pump'),
    // Styles [sass, css]
    sass            = require('gulp-sass'),
    cssnano         = require('gulp-cssnano'),
    autoprefixer    = require('gulp-autoprefixer'),
    // Browserify [es6]
    uglify          = require('gulp-uglify'),
    source          = require('vinyl-source-stream'),
    buffer          = require('vinyl-buffer'),
    browserify      = require('browserify'),
    babelify        = require('babelify'),
    paths           = {
        src: 'src/',
        build: 'dist'
    };

// Sripts
gulp.task('scripts', function (callback) {
    pump([
        browserify({
                entries: paths.src + 'ColorMix.js',
                standalone: 'ColorMix',
                debug: false,
                extensions: ['.js', '.jsx', '.es6'],
                transform: ['babelify']
            })
            .bundle(),
        source('colormix.js'),
        gulp.dest(paths.build),
        buffer(),
        uglify(),
        rename({
            suffix: '.min'
        }),
        gulp.dest(paths.build),
        notify({
            title: "ColorMix library",
            subtitle: 'Scripts successfully compiled',
            sound: 'Pop',
            onLast: false,
            wait: true,
            message: "Compiled <%= file.relative %> @ <%= options.date %>",
            templateOptions: {
                date: new Date()
            }
        })
    ], callback);
});

// Styles
gulp.task('styles', function (callback) {
    pump([
        gulp.src([
            'examples/landing/assets/sass/{,*/}*.{scss,sass}'
        ]),
        sass({
            outputStyle: 'compressed',
        }),
        autoprefixer({
            browsers: ['last 2 versions', '> 1%']
        }),
        cssnano({
            'zindex': false,
            'postcss-merge-idents': false,
            'postcss-reduce-idents': false
        }),
        rename({
            suffix: '.min'
        }),
        gulp.dest('examples/landing/assets/css'),
        notify({
            title: "ColorMix library",
            subtitle: 'Styles successfully compiled',
            sound: 'Pop',
            onLast: false,
            wait: true,
            message: "Compiled <%= file.relative %> @ <%= options.date %>",
            templateOptions: {
                date: new Date()
            }
        })
    ], callback);
});

// Watch
gulp.task('watch', function () {
    // Watch .js files
    gulp.watch('src/**/*.js', ['scripts']);

    // Watch .sass files
    gulp.watch('examples/**/*.{sass,scss}', ['styles']);
});

// Dev
gulp.task('serve', ['scripts', 'styles'], function () {
    gulp.start('watch');
});

gulp.task('build', ['scripts', 'styles']);

// Default task
gulp.task('default', ['serve']);
