// Tools / Plugins
var gulp = require('gulp'),                         // https://www.npmjs.com/package/gulp
    browserSync = require('browser-sync').create(), // https://www.npmjs.com/package/browser-sync
    sass = require('gulp-sass'),                    // https://www.npmjs.com/package/gulp-sass
    autoprefixer = require('autoprefixer'),         // https://www.npmjs.com/package/autoprefixer
    sourcemaps = require('gulp-sourcemaps'),        // https://www.npmjs.com/package/gulp-sourcemaps
    postcss = require('gulp-postcss'),              // https://www.npmjs.com/package/gulp-postcss
    uglify = require('gulp-uglify'),                // https://www.npmjs.com/package/gulp-uglify
    imagemin = require('gulp-imagemin'),            // https://www.npmjs.com/package/gulp-imagemin
    htmlmin = require('gulp-html-minifier'),        // https://www.npmjs.com/package/gulp-html-minifier
    rename = require('gulp-rename'),                // https://www.npmjs.com/package/gulp-html-minifier
    concat = require('gulp-concat');                // https://www.npmjs.com/package/gulp-concat

// Source directory names, Change according to your source.   
var srcPaths = {
    root: 'src/',
    imgDir: 'src/img/',
    sassDir: 'src/scss/',
    jsDir: 'src/js/',
    iconDir: 'src/ico/',
    fontDir: 'src/webfont/',
}
// Distribute / Build directory names, Change according to your needs.   
var buildPaths = {
    root: 'dist/',
    imgDir: 'dist/img/',
    cssDir: 'dist/css/',
    jsDir: 'dist/js/',
    iconDir: 'dist/ico/',
    fontDir: 'dist/webfont/',
}
// Copy minify .html templates
gulp.task('template', function () {
    return gulp.src([srcPaths.root + '**/*.html'])
        .pipe(gulp.dest(buildPaths.root))
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(buildPaths.root))
        .pipe(browserSync.stream()); // browser-sync
});
// Copy static assets ( images )
gulp.task('image', function () {
    return gulp.src(srcPaths.imgDir + "**/*")
        .pipe(imagemin()) // compress images
        .pipe(gulp.dest(buildPaths.imgDir))
        .pipe(browserSync.stream()); // browser-sync
});
// Copy static assets ( icons  )
gulp.task('icon', function () {
    return gulp.src(srcPaths.iconDir + "**/*")
        .pipe(imagemin()) // compress images
        .pipe(gulp.dest(buildPaths.iconDir))
        .pipe(browserSync.stream()); // browser-sync
});
// Copy static assets ( fonts )
gulp.task('font', function () {
    return gulp.src(srcPaths.fontDir + "**/*")
        .pipe(gulp.dest(buildPaths.fontDir))
        .pipe(browserSync.stream()); // browser-sync
});
// Process SASS to CSS
gulp.task('sass', function () {
    return gulp.src(srcPaths.sassDir + '**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(concat('main.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(buildPaths.cssDir))
        .pipe(browserSync.stream()); // browser-sync
});
// Process JS files
gulp.task('js', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
        srcPaths.jsDir + '**/*.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(buildPaths.jsDir))
        .pipe(browserSync.stream());
});
// Serve and monitor
gulp.task('watch', ['template', 'image', 'icon', 'font', 'sass', 'js'], function () {
    browserSync.init({
        server: './' + buildPaths.root
    });
    gulp.watch(srcPaths.sassDir + '**/*.scss', ['sass']);
    gulp.watch(srcPaths.jsDir + '*.js', ['js']);
    gulp.watch(srcPaths.root + '**/*.html', ['template']);
    gulp.watch(srcPaths.imgDir + '**/*', ['image'])
});
// Default
gulp.task('default', ['template', 'image', 'icon', 'font', 'sass', 'js', 'watch']);
