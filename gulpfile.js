var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    jshint = require('gulp-jshint'),
    browserSync = require('browser-sync').create(),
    clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src('./public')
        .pipe(clean(true));
});

gulp.task('lint', function () {
    return gulp.src('./src/app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('browserify', function () {
    return browserify('./src/app/app.js')
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./public/'));
});

gulp.task('copy', ['browserify', 'scss'], function () {
    gulp.src(['./src/**/*.html', './src/**/*.css', './src/**/*.geojson'])
        .pipe(gulp.dest('./public'))
        .pipe(browserSync.stream())
});

gulp.task('scss', function () {
    gulp.src('./src/assets/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/assets/stylesheets/'));
});

gulp.task('build', ['clean', 'lint', 'scss', 'copy']);

gulp.task('browser-sync', ['build'], function () {
    browserSync.init({
        server: {
            baseDir: "./public",
            routes: {
                "/node_modules": "node_modules"
            }
        },
        browser: "google chrome"
    });
});

gulp.task('run', ['browser-sync'], function () {
    gulp.watch("./src/**/*.*", ["build"]);
    gulp.watch("./public/**/*.*").on('change', browserSync.reload);
})
