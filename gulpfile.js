'use strict';

var path   = require('path');
var gulp   = require('gulp');
var rename = require('gulp-rename');

const bowerDir     = path.join(__dirname, 'bower_components');
const librariesDir = path.join(__dirname, 'src/enhancement/resources/libraries');
const themesDir    = path.join(__dirname, 'src/themes');


/**
 * Move all bower dependencies to "src/enhancement/resources/libraries/"
 */
gulp.task('bower', () => {
  /**
   * jQuery
   */
  gulp.src(path.join(bowerDir, 'jquery/dist/jquery.min.js'))
    .pipe(gulp.dest(path.join(librariesDir, 'jquery')));

  /**
   * Lodash
   */
  gulp.src(path.join(bowerDir, 'lodash/lodash.min.js'))
    .pipe(gulp.dest(path.join(librariesDir, 'lodash')));

  /**
   * HighlightJS
   */
  gulp.src(path.join(bowerDir, 'highlightjs/styles/github.css'))
    .pipe(gulp.dest(path.join(librariesDir, 'highlightjs/styles')));
  gulp.src(path.join(bowerDir, 'highlightjs/highlight.pack.min.js'))
    .pipe(gulp.dest(path.join(librariesDir, 'highlightjs')));

  /**
   * Mermaid
   */
  gulp.src([
    path.join(bowerDir, 'mermaid/dist/mermaid.css'),
    path.join(bowerDir, 'mermaid/dist/mermaid.min.js'),
  ])
    .pipe(gulp.dest(path.join(librariesDir, 'mermaid')));

  /**
   * Github Markdown Css
   */
  gulp.src(path.join(bowerDir, 'github-markdown-css/github-markdown.css'))
    .pipe(rename('main.css'))
    .pipe(gulp.dest(path.join(themesDir, 'github/resources')));
});




