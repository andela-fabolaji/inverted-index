'use strict';

const gulp    = require('gulp');
const eslint  = require('gulp-eslint');
const connect = require('gulp-connect');
const run     = require('gulp-run');
const wiredep = require('wiredep').stream;
const inject  = require('gulp-inject');
const bower   = require('gulp-bower');

const paths = {
  jsFiles: ['./src/inverted-index.js', './src/main.js'],
  htmlFiles: '*.html',
  cssFiles: 'public/css/*.css',
  scriptFiles: 'public/js/*.js',
  testFiles: 'jasmine/spec/inverted-index-test.js',
  specRunner: 'jasmine/specRunner.html'
};

// lint
gulp.task('lint', () => {
  return gulp.src(paths.jsFiles)
    .pipe(eslint())
    .pipe(eslint.formatEach())
    .pipe(eslint.failAfterError());
});

// inject
gulp.task('inject', () => {
  const injectSrc = gulp.src(
    [
      'public/css/*.css',
      'public/js/*.js',
      'src/*.js'
    ],
    { read: false }
  );

  const options   = {
        bowerJson: require('./bower.json'),
        directory: './public/lib',
      },
      injectOptions = { ignorePath: '/', addRootSlash: false};

  return gulp.src('./index.html')
    .pipe(wiredep(options))
    .pipe(inject(injectSrc, injectOptions))
    .pipe(gulp.dest('./'));
});

// serve
gulp.task('serve', () => {
  const options = {
    root: './',
    livereload: true,
    port: process.env.PORT || 4000
  };

  connect.server(options);
});

// watch
gulp.task('watch', () => {
  gulp.watch(paths.jsFiles, ['reloadServer']);
  gulp.watch(paths.htmlFiles, ['reloadServer']);
  gulp.watch(paths.cssFiles, ['reloadServer']);
  gulp.watch(paths.scriptFiles, ['reloadServer']);
});

// reload
gulp.task('reloadServer', () => {
  gulp.src(['*.html', 'public/css/*.css', 'public/js/*.js', 'src/*.js'])
    .pipe(connect.reload());
});

//test
gulp.task('test', () => {
  return run('npm test').exec();
});

gulp.task('testWatch', () => {
  gulp.watch(paths.testFiles, ['testReload']);
});

gulp.task('testReload', () => {
  gulp.src(paths.specRunner)
    .pipe(connect.reload());
});

gulp.task('bower', function () {
  return bower('./bower_components')
    .pipe(gulp.dest('public/lib'));
});

gulp.task('default',
['reloadServer', 'testWatch', 'testReload', 'serve', 'watch']
);