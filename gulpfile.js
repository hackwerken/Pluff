var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rev = require('gulp-rev-append'),
    del = require('del'),
    rsync = require('gulp-rsync'),
    fs = require('fs'),
    spawn = require('child_process').spawn,
    prompt = require('gulp-prompt'),
    open = require('open');

// Config.
var serverRoot = 'app',
    stylesFiles = ['app/scss/app.scss'],
    stylesWatch = ['app/scss/**/*'],
    stylesDist = 'app/css',
    jsWatch = ['app/js/**/*.js'],
    jsFiles = [
        // Include each dependency manually.
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
        // Include ever js file from our app.
        'app/js/**/*.js',
        // Except the file all the above files are concatenated in.
        '!app/js/all.js'
    ];
    htmlWatch = ['app/**/*.html'];

// Handle errors while preventing the watch function from quitting.
function handleError (err) {
    gutil.log(err.toString());
    this.emit('end');
}

/**
 * Convert Sass files to css and add necessary browser prefixes.
 */
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

/**
 * Concatenate Javascript files to one big file.
 */
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

/**
 * Watch Sass, javascript and html files and reload them when changed.
 */
gulp.task('watch', function () {
    gulp.watch(stylesWatch, ['sass']);
    gulp.watch(jsWatch, ['javascript']);
    gulp.watch(htmlWatch, ['html']);
});

/**
 * Minify Javascript files.
 */
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

/**
 * Add hashes to index.html
 */
 gulp.task('cachebust', function() {
    gulp.src('dist/index.html')
        .pipe(rev())
        .pipe(gulp.dest('dist'));
 });
/**
 * Copy files from app/ over to dist/ and build them.
 */
gulp.task('copy:dist', ['clean:dist', 'uglify', 'sass'], function () {
    gulp.src('app/**/*')
        .pipe(gulp.dest('dist'));

    gutil.log(gutil.colors.green.bold('To test this build, run \'gulp stage\'.'));
});

/**
 * Enable a 'stage' server to preview the new, built, version.
 */
gulp.task('server:stage', function () {
    connect.server({
        root: 'dist',
        port: 8080,
        fallback: 'dist/index.html'
    });

    gutil.log(gutil.colors.green.bold('When you’re happy, run \'gulp deploy\'.'));

    open('http://localhost:8080');
});

/**
 * Append a comment to dist/index.html with the current commit hash.
 */
gulp.task('appendhash', function () {
    spawn('git', ['rev-parse', '--short', 'HEAD'])
        .stdout.on('data', appendHash)

    function appendHash (hash) {
        hash = hash.toString().trim();

        fs.appendFile('dist/index.html', '<!-- Built from commit: '+ hash +' -->', function (err) {
            if(err)
                gutil.log(err);

            gutil.log('Appended version to index.html');
        });
    }
});

/**
 * Deploy to the pluff.nl server (need to have SSH access to it).
 */
gulp.task('deploy', ['appendhash', 'cachebust'], function () {
    // Check to be sure this is not an accidental deploy.
    if (!fs.existsSync('dist/js/all.js')) {
        gutil.log(gutil.colors.red.bold('Hold your horses! dist/js/all.js does not exist, so you have not ran \'gulp build\' yet.'));
        process.exit(1);
    }

    return gulp.src('dist')
        .pipe(prompt.confirm('Have you commited your files and are you sure you want to deploy?'))
        .pipe(rsync({
            root: 'dist',
            recursive: true,
            destination: '/var/www/pluff',
            hostname: 'touwtjescentrale',
            clean: true
        }));
});

gulp.task('default', ['sass', 'javascript', 'server:dev', 'watch']);
gulp.task('build', ['copy:dist']);
gulp.task('stage', ['server:stage']);
