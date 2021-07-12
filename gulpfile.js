const gulp = require("gulp")
const del = require('del')
const autoprefixer = require("gulp-autoprefixer")
const cleanCSS = require("gulp-clean-css")
const sass = require("gulp-dart-sass")
const sourcemaps = require("gulp-sourcemaps")
const gutil = require("gulp-util")
const plumber = require("gulp-plumber")
const rename = require("gulp-rename")
const gconcat = require("gulp-concat")
const pug = require("gulp-pug")
const uglify = require("gulp-uglify")
const rollup = require('gulp-better-rollup')
const babel = require('gulp-babel');
const browserSync = require("browser-sync").create()


var onError = function (err) {
  this.emit("end")
  gutil.log(gutil.colors.red(err))
};
var caches = {};
function scripts() {
  return gulp
    .src("src/js/*.js")
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env'],
        "plugins": ["@babel/plugin-proposal-private-methods"]
    }))
    .pipe(gconcat("bundle.js", {newLine: ';'}))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dest/js"))
}

function styles() {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    // .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./dest/css"))
    .pipe(browserSync.stream())
}

function template() {
  return gulp
    .src("./src/pug/*.pug")
    .pipe(
      pug({
        doctype: "html",
        pretty: true,
      })
    )
    .pipe(gulp.dest("./dest/"))
}

function copyIMG(cb){
    gulp.src("./src/asset/img/**/*")
        .pipe(gulp.dest("./dest/img"))
    return cb()
}

function cleanDest(cb){
    del.sync([
		"dest/"
	])
    return cb()
}

function startServer(cb){
    browserSync.init({
        port: 3001,
        server: {
            baseDir: "dest",
            serveStaticOptions: {
                extensions: ["html"]
            }
        },
        middleware: [
            {
                route: "/api",
                handle: function (req, res, next) {
                    delete require.cache[require.resolve('./middleware')]
                    require("./middleware")(req, res, next)
                    res.end();
                }

            }
        ]
    })
    return cb()
}

function watchSource(cb){

    gulp.watch(["src/pug/**/*"], template)
    gulp.watch("src/scss/**/*", styles)
    gulp.watch("src/asset/img/**/*", copyIMG)
    gulp.watch("src/js/**/*", scripts).on("change", browserSync.reload)
    gulp.watch("dest/*.html").on("change", browserSync.reload)

    return cb()
}

exports.default = gulp.series(
	cleanDest,
	gulp.parallel( template, styles, scripts )
)

exports.build = gulp.parallel(template, styles, scripts)

exports.watch = gulp.series(
	exports.default,
	startServer,
	watchSource
);
