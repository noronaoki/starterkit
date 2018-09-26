var gulp         = require('gulp');

// CSS系
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var bulkSass     = require('gulp-sass-bulk-import');
var autoprefixer = require('gulp-autoprefixer');

// JS系
var babel        = require('gulp-babel');
var uglify       = require('gulp-uglify');

// その他
var tinypng      = require('gulp-tinypng-compress');
var plumber      = require('gulp-plumber');
var browserSync  = require('browser-sync').create();


// パス
var path = {
  src: {
    html: 'src',
    css:  'src/scss',
    js:   'src/js',
    img:  'src/img'
  },
  dist: {
    html: 'dist',
    css:  'dist/css',
    js:   'dist/js',
    img:  'dist/img'
  }
};


// file copy
gulp.task('copy-html', function(){
  return gulp.src(
    [
      path.src.html + '/*.html'
    ]
  ).pipe(gulp.dest(path.dist.html));
});
gulp.task('copy-img', function(){
  return gulp.src(
    [
      path.src.img + '/**'
    ]
  ).pipe(gulp.dest(path.dist.img));
});
gulp.task('copy-js', function(){
  return gulp.src(
    [
      path.src.js + '/lib/**'
    ]
  ).pipe(gulp.dest(path.dist.js));
});


// sass, bulk import, sourcemaps, autoprefixer
gulp.task('sass', function () {
  return gulp.src(path.src.css + '/style.scss')
  .pipe(plumber())
  .pipe(bulkSass())
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(autoprefixer({
    browsers: ['last 3 version', 'ie >= 11']
  }))
  .pipe(gulp.dest(path.dist.css));
});


// Babel
gulp.task('babel', function() {
  gulp.src(path.src.js + '/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(sourcemaps.write())
    .pipe(uglify())
    .pipe(gulp.dest(path.dist.js))
});


// browserSync
// https://browsersync.io/
gulp.task('browser-sync', function(){
  browserSync.init({
    server: {
      baseDir: './',
      directory: true
    },
    browser: 'google chrome',
    open: 'external',
    notify: false,
    ghostMode: false
  });
});


// bs-reload
gulp.task('bs-reload', function(){
  browserSync.reload();
});


// tiny png
// https://www.npmjs.com/package/gulp-tinypng-compress
gulp.task('tinypng', function () {
  gulp.src(path.dist.img + '/**/*.{png,jpg,jpeg}')
    .pipe(tinypng({
      key: '2zKAuzcolROpQ33qrG94ukm4NADC8gma', // API KEY
      log: true
    }))
    .pipe(gulp.dest(path.dist.img));
});


// watch
gulp.task('watch', function(){
  gulp.watch(path.src.html + '/*.html', ['copy-html']);
  gulp.watch(path.src.img + '/**', ['copy-img']);
  gulp.watch(path.src.js + '/lib/*.js', ['copy-js']);
  gulp.watch(path.src.js + '/*.js', ['babel']);
  gulp.watch(path.src.css + '/**/*.scss', ['sass']);
  gulp.watch([path.dist.html + '/*.html', path.dist.css + '/**/*.css', path.dist.js + '/**/*.js'], ['bs-reload']);
});


// default
gulp.task('default', ['browser-sync', 'watch']);

gulp.task('compile', ['copy-html', 'copy-img', 'copy-js', 'sass', 'babel']);

// compress
gulp.task('compress', ['tinypng']);
