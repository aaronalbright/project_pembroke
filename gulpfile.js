var source = require('vinyl-source-stream');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var gulp = require('gulp');
var browserify = require('browserify');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var gutil = require('gulp-util');
var assign = require('lodash.assign');

var src = './dev';
var customOpts = {
  entries: [src + '/js/script.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

var dest = './app';

gulp.task('js', bundle);

gulp.task('sass', function () {
  return gulp.src( src + '/sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(src + '/css'));
});

gulp.task('css', function() {
   gulp.src( src + '/css/style.css')
    .pipe(concatCss('style.css', { rebaseUrls: false }))
    .pipe(cleanCSS())
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

function bundle() {
  return b.bundle()
  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
  .pipe(source('script.js'))
  // .pipe(streamify(uglify()))
  .pipe(gulp.dest(dest + '/js'));
}
