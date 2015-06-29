/**
 * Created by alex on 02.06.2015.
 */
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


//copy img files
gulp.task('copyimg', function(){
    return gulp.src('./app/img/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./dist/img/'))
});

//copy font files
gulp.task('copyfont', function(){
    return gulp.src('./app/font/**/*')
        .pipe(gulp.dest('./dist/font'))
});

//copy php files
gulp.task('copyphp', function(){
    return gulp.src('./app/*.php')
        .pipe(gulp.dest('./dist/'))
});


//concat css & js files
gulp.task('concat', ['copyimg','copyfont', 'copyphp'], function () {
    var assets = useref.assets();

    return gulp.src('./app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('./dist'));
});

//build (minify-html)
gulp.task('build', ['concat'], function() {
    var opts = {
        empty:true,
        conditionals: true,
        spare:true
    };


    return gulp.src('./dist/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./dist/'));
});

//wiredep
gulp.task('bower', function () {
    gulp.src('./app/index.html')
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
    del('./dist');
});

//html
//gulp.task('html', function () {
//    gulp.src('./app/*.html')
//        .pipe(connect.reload());
//});

//js
//gulp.task('js', function(){
//    gulp.src('./app/js/*.js')
//        .pipe(connect.reload());
//});

//sass
gulp.task('sass', function () {
    gulp.src('./app/sass/main.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./app/css'));
//        .pipe(connect.reload());
});

//watch
gulp.task('watch', function () {
    gulp.watch('./app/sass/main.scss', ['sass']);
//    gulp.watch('./app/js/*.js', ['js']);
//    gulp.watch('./app/*.html', ['html']);
    gulp.watch('bower.json', ['bower']);

});


//default
gulp.task('default',['sass','watch']);



