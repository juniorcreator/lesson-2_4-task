let gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    browserSync   = require('browser-sync'),
    cleancss      = require('gulp-clean-css'),
    autoprefixer  = require('gulp-autoprefixer'),
    sourcemaps 		= require('gulp-sourcemaps'),
    babel = require('gulp-babel');

gulp.task('browser-sync', function() {
  browserSync({
    proxy: false,
    host: 'localhost',
    server: './',
    notify: false,
  });
});

gulp.task('styles', function() {
  return gulp.src('scss/style.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'expanded' })).on('error', function (err) {
        console.log(err.toString());
        this.emit('end');
      })
      .pipe(autoprefixer(['last 15 versions']))
      .pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('css'))
      .pipe(browserSync.stream())
});
gulp.task('es', () => {
  return  gulp.src('js/js.js')
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('js/build'))
});
gulp.task('build', function() {
  return gulp.src('resources/sass/build.scss')
      .pipe(sass({ outputStyle: 'expanded' })).on('error', function (err) {
        console.log(err.toString());
        this.emit('end');
      })
      .pipe(autoprefixer(['last 15 versions']))
      .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
      .pipe(gulp.dest('public/css'))
      .pipe(browserSync.stream())
});

gulp.task('watch', ['styles', 'es', 'browser-sync'], function() {
  gulp.watch('scss/**/*.scss', ['styles']);
  gulp.watch(['js/**/*.js'], ['es']);
  gulp.watch('./*.html', browserSync.reload);
});

gulp.task('default', ['watch']);
