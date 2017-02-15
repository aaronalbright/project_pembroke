var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    sass = require('gulp-sass'),
    concatCss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if');
    webserver = require('gulp-webserver'),
    path = require('path');

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

gulp.task('sass', function () {
  return gulp.src( src + '/sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(src + '/css'));
});

gulp.task('css', function() {
   gulp.src( src + '/css/style.css')
    .pipe(concatCss('style.css', { rebaseUrls: false }))
    .pipe(gulpif(env === 'production', cleanCSS()))
  .pipe(gulp.dest(dest + '/css'));
});

gulp.task('watch', function() {
    gulp.watch(src + '/js/**/*', ['js']);
    gulp.watch( src + '/sass/style.scss', ['sass']);
    gulp.watch(src + '/css/*.css', ['css']);
    gulp.watch(dest + '/*.html');
});

gulp.task('webserver', ['sass', 'css','js'], function() {
  gulp.src(dest)
  .pipe(webserver({
      livereload: true,
      open: true
  }));
});

gulp.task('default', ['watch','webserver']);
