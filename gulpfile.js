var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    rsync = require('gulp-rsync'),
    fs = require('fs'),
    prompt = require('gulp-prompt'),
    open = require('open');

// Config.
var serverRoot = 'app',
    stylesFiles = ['app/scss/app.scss'],
    stylesWatch = ['app/scss/**/*'],
    stylesDist = 'app/css',
    jsWatch = ['app/js/**/*.js'],
    jsFiles = [
        'node_modules/angular/angular.min.js',
        'node_modules/angular-route/angular-route.min.js',
        'node_modules/angular-cookies/angular-cookies.min.js',
        'node_modules/angular-translate/dist/angular-translate.min.js',
        'node_modules/angular-translate/dist/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
        'node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        'node_modules/angucomplete-alt/dist/angucomplete-alt.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/moment/min/moment.min.js',
        'node_modules/moment/locale/nl.js',
        'node_modules/ng-dialog/js/ngDialog.min.js',
        'node_modules/angular-loading-bar/build/loading-bar.min.js',
        'node_modules/angular-touch/angular-touch.min.js',
        'app/js/**/*.js',
        '!app/js/all.js'
    ];
    htmlWatch = ['app/**/*.html'];

// Handle errors while preventing the watch function from quitting.
function handleError (err) {
    gutil.log(err.toString());
    this.emit('end');
}

gulp.task('sass', function () {
    return gulp.src(stylesFiles)
        .pipe(sass())
        .on('error', handleError)
        .pipe(autoprefixer({
            browsers: ['last 1 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(stylesDist))
        .pipe(connect.reload());
});

gulp.task('server:dev', function () {
    connect.server({
        root: serverRoot,
        livereload: true,
        port: 8080,
        fallback: path.join(serverRoot, 'index.html')
    });

    open('http://localhost:8080');
});

gulp.task('javascript', function () {
    return gulp.src(jsFiles)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('app/js'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    return gulp.src(htmlWatch)
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(stylesWatch, ['sass']);
    gulp.watch(jsWatch, ['javascript']);
    gulp.watch(htmlWatch, ['html']);
});

gulp.task('uglify', ['javascript'], function () {
    return gulp.src('app/js/all.js')
        .pipe(uglify({
            compress: {
                drop_console: true
            },
            mangle: false
        }))
        .pipe(gulp.dest('app/js'));
});

gulp.task('clean:dist', function (cb) {
    del([
        'dist/**/*'
    ], cb);
});

gulp.task('copy:dist', ['clean:dist', 'uglify', 'sass'], function () {
    gulp.src('app/**/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('server:stage', function () {
    connect.server({
        root: 'dist',
        port: 8080,
        fallback: 'dist/index.html'
    });

    open('http://localhost:8080');
});

gulp.task('deploy', function () {
    // Check to be sure this is not an accidental deploy.
    if (!fs.existsSync('dist/js/all.js')) {
        gutil.log(gutil.colors.red.bold('Hold your horses! dist/js/all.js does not exist, so you have not ran \'gulp build\' yet.'));
        process.exit(1);
    }

    return gulp.src('dist')
        .pipe(prompt.confirm('Are you sure you want to deploy?'))
        .pipe(rsync({
            root: 'dist',
            recursive: true,
            destination: '/var/www/pluff-rsync',
            hostname: 'touwtjescentrale',
            clean: true
        }));
});

gulp.task('default', ['sass', 'javascript', 'server:dev', 'watch']);
gulp.task('build', ['copy:dist']);
gulp.task('stage', ['server:stage']);
