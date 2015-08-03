/*jslint node: true */
/* jshint -W097 */

'use strict';

var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    jade = require('gulp-jade'),
    inject = require('gulp-inject'),
    bower = require('main-bower-files'),
    sass = require('gulp-ruby-sass'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    nodemon = require('gulp-nodemon');

gulp.task('server-coffee', function () {
    gulp.src('api/**/*.coffee', {
            base: './'
        })
        .pipe(coffee())
        .pipe(gulp.dest('./'));
});

gulp.task('app-coffee', function () {
    gulp.src('app/coffee/**/*.coffee')
        .pipe(coffee())
        .pipe(gulp.dest('app/public/js/'));
});

gulp.task('app-stylesheets', function () {
    sass('./app/scss', {
            style: 'expanded'
        })
        .pipe(gulp.dest('./app/public/css'))
        .pipe(plumber())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifycss())
        .pipe(gulp.dest('./app/public/css/'))
});

gulp.task('move-bower', function () {
    gulp.src(bower({
            filter: /\.js$/i,
            paths: {
                bowerDirectory: './bower_components'
            }
        }))
        .pipe(gulp.dest('./app/public/dist/js'));

    gulp.src(bower({
            filter: /\.css$/i,
            paths: {
                bowerDirectory: './bower_components'
            }
        }))
        .pipe(gulp.dest('./app/public/dist/css'));

    gulp.src('./bower_components/bootstrap/dist/fonts/*').pipe(gulp.dest('./app/public/dist/fonts'));
    gulp.src('./bower_components/bootstrap/dist/css/bootstrap.css.map').pipe(gulp.dest('./app/public/dist/css'));
});

gulp.task('app-index', function () {
    gulp.src('app/jade/index.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(inject(gulp.src(
            [
                'app/public/dist/js/jquery.js',
                'app/public/dist/js/bootstrap.js',
                'app/public/dist/js/angular.js',
                'app/public/dist/js/**/*.js',
                'app/public/dist/css/**/*.css'
            ]), {
            ignorePath: '/app/public/',
            addRootSlash: false
        }))
        .pipe(gulp.dest('app/public'));
});

gulp.task('app-views', function () {
    gulp.src('app/jade/views/**/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('app/public/views'));
});

gulp.task('serve', function () {
    nodemon({
        script: 'api/server.js',
        ext: 'js'
    });
});

gulp.task('watch', function () {
    gulp.watch('./**/*.coffee', ['server-coffee', 'app-coffee']);
    gulp.watch('./**/*.jade', ['app-index', 'app-views']);
    gulp.watch('./**/*.scss', ['app-stylesheets']);
});

gulp.task('default', ['move-bower', 'server-coffee', 'app-coffee', 'app-views', 'app-index', 'serve', 'watch'], function () {
    // Do nothing ;) 
});