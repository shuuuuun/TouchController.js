const DEST_PATH = './build/';
const SRC_PATH = './src/';
const GLOB_PATH = `${SRC_PATH}**/*.js`;
const GLOB_UNBUILD = `!${SRC_PATH}**/_**`;

const gulp = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');


// tasks
gulp.task('default', ['watch', 'js', 'js-min']);

gulp.task('watch', () => {
  gulp.watch([GLOB_PATH], ['js', 'js-min']);
});

gulp.task('js', () => {
  // minifyしない
  gulp.src([GLOB_PATH, GLOB_UNBUILD])
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest(DEST_PATH));
});

gulp.task('js-min', () => {
  // minifyする
  gulp.src([GLOB_PATH, GLOB_UNBUILD])
    .pipe(plumber())
    .pipe(babel())
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(rename((path) => {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(DEST_PATH));
});
