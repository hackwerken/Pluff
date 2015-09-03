var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rev = require('gulp-rev-append'),
    dotenv = require('dotenv'),
    del = require('del'),
    ftp = require('vinyl-ftp'),
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
        'node_modules/satellizer/satellizer.min.js',
        // Include every js file from our app.
        'app/js/**/*.js',
        // Except the file all the above files are concatenated in.
        '!app/js/all.js'
    ],
    htmlWatch = ['app/**/*.html'];

// Handle errors while preventing the watch function from quitting.
function handleError (err) {
    gutil.log(err.toString());
    this.emit('end');
}

/**
 * Convert Sass files to css and add necessary browser prefixes.
 */
function buildSass () {
    return gulp.src(stylesFiles)
        .pipe(sass())
        .on('error', handleError)
        .pipe(autoprefixer({
            browsers: ['last 1 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(stylesDist))
        .pipe(connect.reload());
}

function connectDevServer () {
    connect.server({
        root: serverRoot,
        livereload: true,
        port: 8080,
        fallback: path.join(serverRoot, 'index.html')
    });

    open('http://localhost:8080');
}

/**
 * Concatenate Javascript files to one big file.
 */
function buildJavascript () {
    return gulp.src(jsFiles)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('app/js'))
        .pipe(connect.reload());
}

function reloadHtml () {
    return gulp.src(htmlWatch)
        .pipe(connect.reload());
}

/**
 * Watch Sass, javascript and html files and reload them when changed.
 */
function watch () {
    gulp.watch(stylesWatch, buildSass);
    gulp.watch(jsWatch, buildJavascript);
    gulp.watch(htmlWatch, reloadHtml);
}

/**
 * Minify Javascript files.
 */
function uglifyJavascript () {
    return gulp.src('app/js/all.js')
        .pipe(uglify({
            compress: {
                drop_console: true
            },
            mangle: false
        }))
        .pipe(gulp.dest('app/js'));
}

function cleanDist (cb) {
    del(['dist/**/*']).then(cb);
}

/**
 * Add hashes to index.html
 */
function bustCache () {
    return gulp.src('dist/index.html')
       .pipe(rev())
       .pipe(gulp.dest('dist'));
}

/**
 * Copy files from app/ over to dist/ and build them.
 */
function copyDist () {
    return gulp.src(['app/**/*', 'humans.txt'])
        .pipe(gulp.dest('dist'));
}

/**
 * Enable a 'stage' server to preview the new, built, version.
 */
function connectStageServer () {
    gutil.log(gutil.colors.green.bold('Opening stage server, please test all your changes.'));

    connect.server({
        root: 'dist',
        port: 8080,
        fallback: 'dist/index.html'
    });

    gutil.log(gutil.colors.green.bold('When you’re happy, run \'npm run deploy\'.'));

    open('http://localhost:8080');
}

/**
 * Append a comment to dist/index.html with the current commit hash.
 */
function appendHashToFile (cb) {
    spawn('git', ['rev-parse', '--short', 'HEAD'])
        .stdout.on('data', appendHash);

    function appendHash (hash) {
        hash = hash.toString().trim();

        fs.appendFile('dist/index.html', '<!-- Built from commit: '+ hash +' -->', function (err) {
            if (err)
                gutil.log(err);

            gutil.log('Appended version to index.html');
            cb();
        });
    }
}

/**
 * Deploy to the given FTP server.
 */
function pushToServer () {
    // Check to be sure this is not an accidental deploy.
    if (!fs.existsSync('dist/js/all.js')) {
        gutil.log(gutil.colors.red.bold('Hold your horses! dist/js/all.js does not exist, so you have not ran \'gulp build\' yet.'));
        process.exit(1);
    }

    dotenv.load();

    var conn = ftp.create({
        host: process.env.PLUFF_FTP_HOST,
        user: process.env.PLUFF_FTP_USER,
        password: process.env.PLUFF_FTP_PASSWORD,
        parallel: 10,
        log: gutil.log
    });

    return gulp.src('dist/**', {base: 'dist', buffer: false})
        .pipe(prompt.confirm('Have you committed your files and are you sure you want to deploy?'))
        .pipe(conn.newerOrDifferentSize(process.env.PLUFF_FTP_DIST))
        .pipe(conn.dest(process.env.PLUFF_FTP_DIST));
}

gulp.task('dev', gulp.parallel(buildSass, buildJavascript, connectDevServer, watch));

gulp.task('build', gulp.series(
    cleanDist,
    buildJavascript,
    uglifyJavascript,
    buildSass,
    copyDist
));

gulp.task('stage', gulp.series(connectStageServer))

gulp.task('deploy', gulp.series(
    appendHashToFile,
    bustCache,
    pushToServer
));

gulp.task('default', gulp.series('dev'));
