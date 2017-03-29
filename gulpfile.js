var source = require('vinyl-source-stream'),
watchify = require('watchify'),
streamify = require('gulp-streamify'),
gulp = require('gulp'),
browserify = require('browserify'),
less = require('gulp-less'),
concatCss = require('gulp-concat-css'),
cleanCSS = require('gulp-clean-css'),
uglify = require('gulp-uglify'),
webserver = require('gulp-webserver'),
gutil = require('gulp-util'),
assign = require('lodash.assign');

var src = './dev';
var customOpts = {
  entries: [src + '/js/script.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

var dest = './app';

gulp.task('js', bundle);

gulp.task('less', function () {
  return gulp.src( src + '/less/style.less')
    .pipe(less())
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
    gulp.watch(src + '/less/*.less', ['less']);
    gulp.watch(dest + '/*.html');
});

gulp.task('webserver', ['less','css','js'], function() {
  gulp.src(dest)
  .pipe(webserver({
      livereload: false
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
