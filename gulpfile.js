"use strict";



var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var minifyCss = require('gulp-minify-css');
var rename = require("gulp-rename");
//var livereload = require('livereload');
//var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var wiredep = require('wiredep').stream;
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
var rigger = require('gulp-rigger');
var plumber = require('gulp-plumber');


var path = {
    dist: {
        html:'./dist/',
        js:'./dist/js/',
        css:'./dist/css/',
        img:'./dist/img/',
        fonts:'./dist/font/',
        php:'./dist/'
    },
    app:{
        html:'./app/*.html',
        js:'./app/js/main.js',
        scss:'./app/sass/main.scss',
        img:'./app/img/**/*.*',
        fonts:'./app/font/**/*.*',
        php:'./app/*.php'
    },
    watch:{
        html:'./app/**/*.html',
        js:'./app/js/**/*.js',
        scss:'./app/sass/**/*.scss',
        img:'./app/img/**/*.*',
        fonts:'./app/font/**/*.*'
    },
    clean:'./dist'
};

//copy img files
gulp.task('copyimg', function(){
    return gulp.src(path.app.img)
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(path.dist.img))
});

//copy font files
gulp.task('copyfont', function(){
    return gulp.src(path.app.fonts)
        .pipe(plumber())
        .pipe(gulp.dest(path.dist.fonts))
});

//copy php files
gulp.task('copyphp', function(){
    return gulp.src(path.app.php)
        .pipe(plumber())
        .pipe(gulp.dest(path.dist.php))
});


//concat css & js files
gulp.task('concat', ['copyimg','copyfont', 'copyphp'], function () {
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




//build (+minify-html)
gulp.task('build', ['concat'], function() {
    var opts = {
        empty:true,
        conditionals: true,
        spare:true,
        quotes:true
    };


    return gulp.src(path.dist.html+'*.html')
        .pipe(plumber())
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(path.dist.html));
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

//connect
//gulp.task('connect', function() {
//    connect.server({
//        root: 'app',
//        livereload: true
//    });
//});


//clean dist
gulp.task('clean', function () {
    del(path.clean);
});

//html
/*
gulp.task('html', function () {
    gulp.src(path.app.html)
        .pipe(connect.reload());
});
*/


//sass
gulp.task('sass', function () {
    gulp.src(path.app.scss)
        .pipe(plumber())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./app/css'));
//        .pipe(connect.reload());
});

//watch
gulp.task('watch', function () {
    gulp.watch(path.watch.scss, ['sass']);
//    gulp.watch('./app/*.html', ['html']);
    gulp.watch('bower.json', ['bower']);

});


//default
gulp.task('default',['sass','watch']);



