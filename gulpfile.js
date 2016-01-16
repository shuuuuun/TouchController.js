var DEST_PATH = './build/';

var gulp = require('gulp');
var plumber = require( 'gulp-plumber' );
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var rename = require('gulp-rename');


// default task
if (gutil.env.develop) gulp.task('default',['watch', 'js-dev']);
else gulp.task('default',['watch', 'js']);


gulp.task('watch',function(){
  watch(['./src/*.js','./src/**/*.js','./src/**/_*.js'],function(){
    if (gutil.env.develop) gulp.start('js-dev');
    else gulp.start('js');
  });
});

gulp.task('js-dev',function(){
  // minifyしない
  gulp.src(['./src/*.js','./src/**/*.js','./src/**/_*.js'])
    .pipe(plumber())
    .pipe(gulp.dest(DEST_PATH));
});

gulp.task('js',function(){
  // minifyする
  gulp.src(['./src/*.js','./src/**/*.js','./src/**/_*.js'])
    .pipe(plumber())
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(rename(function(path){
      path.basename += '.min';
    }))
    .pipe(gulp.dest(DEST_PATH));
});
