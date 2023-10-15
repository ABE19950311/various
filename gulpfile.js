const gulp = require("gulp");
const rename = require("gulp-rename");
const ejs = require("gulp-ejs");
const replace = require("gulp-replace");
const plumber = require('gulp-plumber');

// EJSコンパイル
const EJScompile = (done) => {
    gulp.src(["index.ejs"])
      .pipe(plumber())
      .pipe(ejs({}, {}, { ext: '.html' }))
      .pipe(rename({ extname: '.html' }))
      .pipe(replace(/^[ \t]*\n/gmi, ''))
      .pipe(gulp.dest("./dest/"));
    done();
};

// タスク化
exports.EJScompile = EJScompile;

// 監視ファイル
const watchFiles = (done) => {
    gulp.watch(["index.ejs"], EJScompile);
    done();
};

// タスク実行
exports.default = gulp.series(
    watchFiles,EJScompile
);