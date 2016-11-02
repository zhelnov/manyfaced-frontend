var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    nodemon = require('gulp-nodemon');

gulp.task('start', function () {
    nodemon({
        script: 'app.js',
        ext: 'js jsx ejs',
        execMap: {
            js: './run.sh'
        },
        ignore: ["public/*"]
    });
});

gulp.task('scripts', function () {
    gulp.src(['app/main.js'])
        .pipe(browserify({
            debug: true,
            transform: [ 'reactify' ]
        }))
        .pipe(gulp.dest('./public/'));
});

gulp.task('default', ['scripts']);
