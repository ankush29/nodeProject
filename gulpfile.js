'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
  return gulp.src('public/stylesheets/sass/common.scss')
  	.pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('build.css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/stylesheets/css'));
});

 
gulp.task('watch', function () {
  gulp.watch('public/stylesheets/sass/common.scss', ['sass']);
});


gulp.task('default', ['watch']);