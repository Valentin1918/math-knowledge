var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('./app/assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/assets/css/'));
});

gulp.task('watch',function() {
    gulp.watch('./app/assets/sass/**/*.scss',['sass']);
});
// Default Task
gulp.task('default', ['watch']);