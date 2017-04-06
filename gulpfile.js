var gulp         = require('gulp');

// HTML系
var slim         = require("gulp-slim");

// CSS系
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var bulkSass     = require('gulp-sass-bulk-import');
var spritesmith  = require('gulp.spritesmith');
var autoprefixer = require('gulp-autoprefixer');

// JS系
var babel        = require('gulp-babel');
var uglify       = require('gulp-uglify');

// その他
var tinypng      = require('gulp-tinypng-compress');
var plumber      = require('gulp-plumber');
var browserSync  = require('browser-sync').create();
var aigis        = require('gulp-aigis');


// パス
var path = {
  src: {
    slim: 'src/slim',
    css:  'src/scss',
    js:   'src/js',
    img:  'src/img'
  },
  dist: {
    html: 'dist/html',
    css:  'dist/css',
    js:   'dist/js',
    img:  'dist/img'
  }
};


// slim
// https://www.npmjs.com/package/gulp-slim
gulp.task('slim', function(){
  gulp.src(path.src.slim + '/*.slim')
  .pipe(plumber())
  .pipe(slim({
    options: "encoding='utf-8'"
  }))
  .pipe(gulp.dest(path.dist.html));
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
    browsers: ['last 3 version', 'ie 11']
  }))
  .pipe(gulp.dest(path.dist.css));
});


// sprite
// https://www.npmjs.com/package/gulp.spritesmith
gulp.task('sprite', function () {
  var spriteData = gulp.src(path.src.img + '/sprite/*.png')
  .pipe(plumber())
  .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    imgPath: '#{$path-img}/sprite.png',
    retinaSrcFilter: path.src.img + '/sprite/*@2x.png',
    retinaImgName: 'sprite@2x.png',
    retinaImgPath: '#{$path-img}/sprite@2x.png',
    // cssFormat: 'scss', // これを書くとRetina用のMixinとかが生成されないバグがある
    algorithm: 'binary-tree', //結合アルゴリズム(top-down (default), left-right, diagonal, alt-diagonal, binary-tree)
    padding: 0,
    cssVarMap: function (sprite) {
      sprite.name = 'sprite-' + sprite.name;
    }
  }));
  spriteData.img.pipe(gulp.dest(path.dist.img));
  spriteData.css.pipe(gulp.dest(path.src.css + '/2_tools/'));
});


// Babel
gulp.task('babel', function() {
  gulp.src(path.src.js + '/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(sourcemaps.write())
    .pipe(uglify({preserveComments: 'some'}))
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
    notify: false
  });
});


// bs-reload
gulp.task('bs-reload', function(){
  browserSync.reload();
});


// aigis
gulp.task('aigis', function() {
  return gulp.src('./aigis/aigis_config.yml')
    .pipe(aigis());
});


// tiny png
// https://www.npmjs.com/package/gulp-tinypng-compress
gulp.task('tinypng', function () {
  gulp.src(path.dist.img + '/**/*.{png,jpg,jpeg}')
    .pipe(tinypng({
      key: '', // API KEY
      log: true
    }))
    .pipe(gulp.dest(path.dist.img));
});


// watch
gulp.task('watch', function(){
  gulp.watch(path.src.slim + '/**/*.slim', ['slim']);
  gulp.watch(path.src.css + '/**/*.scss', ['sass', 'aigis']);
  gulp.watch(path.src.img + '/sprite/*.png', ['sprite']);
  gulp.watch(path.src.js + '/*.js', ['babel']);
  gulp.watch([path.dist.html + '/**/*.html', path.dist.css + '/**/*.css', path.dist.js + '/**/*.js'], ['bs-reload']);
});


// default
gulp.task('default', ['slim', 'sass', 'sprite', 'babel', 'browser-sync', 'watch']);


// compress
gulp.task('compress', ['tinypng']);
