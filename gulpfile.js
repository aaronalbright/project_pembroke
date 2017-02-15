var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    concatCss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if');
    webserver = require('gulp-webserver')
    path = require('path'),
    swPrecache = require('sw-precache');

var src = './dev',
dest = './app'
env = 'production';

gulp.task('js', function() {
  return gulp.src(src + '/js/script.js')
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify()))
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(gulp.dest(dest + '/js'));
});

gulp.task('css', function() {
  gulp.src( src + '/css/style.css')
    .pipe(concatCss('style.css', { rebaseUrls: false }))
    .pipe(gulpif(env === 'production', cleanCSS()))
  .pipe(gulp.dest(dest + '/css'));
});

gulp.task('watch', function() {
    gulp.watch(src + '/css/*.css', ['css']);
    gulp.watch(dest + '/*.html');
});

gulp.task('webserver', ['css', 'js'], function() {
  gulp.src(dest)
  .pipe(webserver({
      livereload: true,
      open: true
  }));
});

gulp.task('default', ['watch', 'webserver']);
