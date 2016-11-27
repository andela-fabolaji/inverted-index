'use strict';

const gulp    = require('gulp'),
      eslint  = require('gulp-eslint'),
      jscs    = require('gulp-jscs'),
      connect = require('gulp-connect'),
      run     = require('gulp-run'),
      wiredep = require('wiredep').stream,
      inject  = require('gulp-inject');

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
    port: process.env.port || 3000
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

gulp.task('default',
['reloadServer', 'testWatch', 'testReload', 'serve', 'watch']
);