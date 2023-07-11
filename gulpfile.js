'use strict'

const {src, dest, series, parallel, watch} = require('gulp')

const sass = require('gulp-sass')(require('node-sass'))
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const plumber = require('gulp-plumber')
const cssbeautify = require('gulp-cssbeautify')
const rename = require('gulp-rename')
const cleanCss = require('gulp-clean-css')
const browserSync = require('browser-sync').create()
const notify = require('gulp-notify')
const fileinclude = require('gulp-file-include')
const del = require('del')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const svgSprite = require('gulp-svg-sprite')
const svgmin = require('gulp-svgmin')
const cheerio = require('gulp-cheerio')
const replace = require('gulp-replace')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')

// Paths
const srcPath = 'src/'
const distPath = 'dist/'

const path = {
	build: {
		html: distPath,
		css: distPath + 'assets/css',
		js: distPath + 'assets/js',
		img: distPath + 'assets/img',
		svg: distPath + 'assets/img/svg',
		vendors: distPath + 'assets/vendors',
	},
	src: {
		html: srcPath + '**/*.html',
		css: srcPath + 'assets/scss/**/*.scss',
		js: srcPath + 'assets/js/*.js',
		img: srcPath + 'assets/img/*.{jpg, jpeg, png}',
		svg: srcPath + 'assets/img/svg/**/*.svg',
		vendors: srcPath + 'assets/vendors/**/*.{css,js}',
	},
	clean: distPath,
}

function serve() {
	browserSync.init({
		server: {
			baseDir: distPath,
		},
	})
}

function html() {
	return src(path.src.html)
		.pipe(
			fileinclude({
				prefix: '@',
				basepath: '@file',
			})
		)
		.pipe(dest(path.build.html))
		.pipe(browserSync.stream())
}

function css() {
	return src(path.src.css)
		.pipe(
			plumber({
				errorHandler: function (err) {
					notify.onError({
						title: 'SCSS Error',
						message: 'Error: <%= error.message %>',
					})(err)
					this.emit('end')
				},
			})
		)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
		.pipe(cssbeautify())
		.pipe(sourcemaps.write('.'))
		.pipe(dest(path.build.css))
		.pipe(
			cleanCss({
				level: 2,
			})
		)
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browserSync.stream())
}

function js() {
	return src(path.src.js)
		.pipe(
			plumber({
				errorHandler: function (err) {
					notify.onError({
						title: 'JS Error',
						message: 'Error: <%= error.message %>',
					})(err)
					this.emit('end')
				},
			})
		)
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browserSync.stream())
}

function img() {
	return src(path.src.img)
		.pipe(
			imagemin({
				gifsicle: {interlaced: true},
				mozjpeg: {quality: 80, progressive: true},
				optipng: {optimizationLevel: 5},
				svgo: {plugins: [{removeViewBox: true}, {cleanupIDs: false}]},
			})
		)
		.pipe(dest(path.build.img))
}

function webpImg() {
	return src(path.src.img)
		.pipe(webp())
		.pipe(dest(distPath + 'assets/img/webp'))
}

function svg() {
	return src(path.src.svg)
		.pipe(
			svgmin({
				js2svg: {
					pretty: true,
				},
			})
		)
		.pipe(
			cheerio({
				run: function ($) {
					$('[fill]').removeAttr('fill')
					$('[stroke]').removeAttr('stroke')
					$('[style]').removeAttr('style')
				},
				parserOptions: {
					xmlMode: true,
				},
			})
		)
		.pipe(replace('&gt;', '>'))
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: '../sprite.svg',
					},
				},
			})
		)
		.pipe(dest(path.build.svg))
}

function vendors() {
	return src(path.src.vendors)
		.pipe(dest(path.build.vendors))
		.pipe(browserSync.stream())
}

function watchFiles() {
	watch([path.src.css], css)
	watch([path.src.html], html)
	watch([path.src.js], js)
	watch([path.src.img], img)
	watch([path.src.vendors], vendors)
}

function clean() {
	return del(path.clean)
}

const dev = series(
	clean,
	parallel(html, css, js, img, webpImg, svg, vendors),
	serve
)

const runParallel = parallel(dev, watchFiles)

exports.html = html
exports.css = css
exports.js = js
exports.img = img
exports.webpImg = webpImg
exports.svg = svg
exports.dev = dev
exports.vendors = vendors
exports.default = runParallel

exports.watchFiles = watchFiles
