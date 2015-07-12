"use strict";

var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var minifyCss = require('gulp-minify-css');
var rename = require("gulp-rename");
var autoprefixer = require('gulp-autoprefixer');
var wiredep = require('wiredep').stream;
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
var rigger = require('gulp-rigger');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');


var path = {
    dist: {
        html: './dist/',
        js: './dist/js/',
        css: './dist/css/',
        img: './dist/img/',
        fonts: './dist/font/',
        php: './dist/'
    },
    app: {
        html: './app/*.html',
        js: './app/js/main.js',
        css: './app/css/',
        scss: './app/sass/main.scss',
        img: './app/img/**/*.*',
        fonts: './app/font/**/*.*',
        php: './app/*.php'
    },
    watch: {
        html: './app/**/*.html',
        js: './app/js/**/*.js',
        scss: './app/sass/**/*.scss',
        img: './app/img/**/*.*',
        fonts: './app/font/**/*.*'
    }
};



//copy img files
gulp.task('copy-img', function () {
    return gulp.src(path.app.img)
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(path.dist.img))
});

//copy font files
gulp.task('copy-font', function () {
    return gulp.src(path.app.fonts)
        .pipe(plumber())
        .pipe(gulp.dest(path.dist.fonts))
});

//copy php files
gulp.task('copy-php', function () {
    return gulp.src(path.app.php)
        .pipe(plumber())
        .pipe(gulp.dest(path.dist.php))
});

//assemble html, concat css & js files
gulp.task('html', function () {
    var assets = useref.assets();

    return gulp.src(path.app.html)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(path.dist.html))
});

//assemble html, concat css & js files + minify files
gulp.task('build-html', function () {
    var assets = useref.assets();

    return gulp.src(path.app.html)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(path.dist.html));
});


//minify-html
gulp.task('minify-html', function () {
    var opts = {
        empty: true,
        conditionals: true,
        spare: true,
        quotes: true
    };


    return gulp.src(path.dist.html + '*.html')
        .pipe(plumber())
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(path.dist.html))
});


//wiredep
gulp.task('bower', function () {
    gulp.src(path.app.html)
        .pipe(plumber())
        .pipe(wiredep({
            directory: "app/bower_components"
        }))
        .pipe(gulp.dest('./app'));
});


//clean dist
gulp.task('clean', function () {
    return gulp.src(path.dist.html, {read: false})
        .pipe(clean());
});

//sass
gulp.task('sass', function () {
    gulp.src(path.app.scss)
        .pipe(plumber())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(path.app.css));

});


//watch
gulp.task('watch', function () {

    gulp.watch(path.watch.scss, function (event) {
        runSequence('sass','html');
    });
    gulp.watch('bower.json', ['bower']);
    gulp.watch(path.watch.html, ['html']);
    gulp.watch(path.watch.js, ['html']);
});


//default
gulp.task('default', function (callback) {
    runSequence(
        'sass',
        ['copy-img', 'copy-font', 'copy-php'],
        'html',
        'watch',
        callback)});


//build project
gulp.task('build', function (callback) {
    runSequence('clean',
        'sass',
        ['copy-img', 'copy-font', 'copy-php'],
        'build-html',
        'minify-html',
        callback)});