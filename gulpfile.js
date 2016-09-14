const batch = require('gulp-batch');

var gulp        = require('gulp'),
    less        = require('gulp-less'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps');

// Workaround for https://github.com/gulpjs/gulp/issues/71
var origSrc = gulp.src;
gulp.src = function () {
    return fixPipe(origSrc.apply(this, arguments));
};
function fixPipe(stream) {
    var origPipe = stream.pipe;
    stream.pipe = function (dest) {
        arguments[0] = dest.on('error', function (error) {
            var nextStreams = dest._nextStreams;
            if (nextStreams) {
                nextStreams.forEach(function (nextStream) {
                    nextStream.emit('error', error);
                });
            } else if (dest.listeners('error').length === 1) {
                throw error;
            }
        });
        var nextStream = fixPipe(origPipe.apply(this, arguments));
        (this._nextStreams || (this._nextStreams = [])).push(nextStream);
        return nextStream;
    };
    return stream;
}


var lessPath = [
    'src/less/*.less',
];

gulp.task('style', function() {
    return gulp.src(lessPath)
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(''));
});

gulp.task('watch', function() {
    gulp.watch(['src/less/*.less'], ['style']) ;
});

gulp.task('default', ['style', 'watch']);

gulp.task('build', ['style']);