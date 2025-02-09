const { watch, series, src, dest } = require("gulp")
const terser = require("gulp-terser")
const sass = require("gulp-sass")(require("sass"))
const sourcemaps = require("gulp-sourcemaps")
const browserSync = require("browser-sync").create()
const rename = require("gulp-rename")
const concat = require("gulp-concat")

// ====---------------====
// Paths
// ====---------------====
const paths = {
  js: {
    input: [
      "./node_modules/simple-theme-switcher/theme-switcher.js",
      "./src/js/main.js",
    ],
    output: "./dist/js/",
  },
  styles: {
    input: "./src/sass/**/*.scss",
    output: "./dist/css/",
  },
  html: "./dist/**/*.html",
  reload: "./dist/",
}

// ====---------------====
// Styles
// ====---------------====
function buildStyles() {
  return src(paths.styles.input)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest(paths.styles.output))
    .pipe(browserSync.stream())
}

// ====---------------====
// JS
// ====---------------====
function buildJs() {
  return src(paths.js.input)
    .pipe(concat("main.js"))
    .pipe(terser())
    .pipe(rename("main.min.js"))
    .pipe(dest(paths.js.output))
}

// ====---------------====
// Browsersync
// ====---------------====

// Watch for changes to the src directory
var startServer = function (done) {
  // Make sure this feature is activated before running
  // Initialize BrowserSync
  browserSync.init({
    server: {
      baseDir: paths.reload,
    },
    open: false,
  })
  done()
}

// Reload the browser when files change
var reloadBrowser = function (done) {
  browserSync.reload()
  done()
}

// ====---------------====
// Watchers 👀
// ====---------------====
function watchSource() {
  watch(paths.styles.input, series(buildStyles))
  watch(paths.js.input, series(buildJs, reloadBrowser))
  watch(paths.html, series(reloadBrowser))
}

// ====---------------====
// Export tasks
// ====---------------====
exports.buildStyles = buildStyles
exports.buildJs = buildJs
exports.watch = series(startServer, watchSource)

// ====---------------====
// Default
// ====---------------====
exports.default = series(buildJs, buildStyles)
