'use strict'

const {src, dest, series, parallel, watch} = require('gulp')

const sass = require('gulp-sass')(require('node-sass'))
const autoprefixer = require('gulp-autoprefixer')
const plumber = require('gulp-plumber')
const cssbeautify = require('gulp-cssbeautify')
const rename = require('gulp-rename')
const cleanCss = require('gulp-clean-css')
const browserSync = require('browser-sync').create()
const notify = require('gulp-notify')
const fileinclude = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
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
		fonts: distPath + 'assets/fonts',
	},
	src: {
		html: srcPath + '/*.html',
		css: srcPath + 'assets/scss/**/*.scss',
		js: srcPath + 'assets/js/*.js',
		img: srcPath + 'assets/img/*.{jpg,jpeg,png,svg}',
		svg: srcPath + 'assets/img/svg/**/*.svg',
		vendors: srcPath + 'assets/vendors/**/*.{css,js}',
		fonts: srcPath + 'assets/fonts/**/*',
	},
	clean: distPath,
}

let isProd = false // dev default

function html() {
	return src(path.src.html)
		.pipe(
			fileinclude({
				prefix: '@',
				basepath: '@file',
			})
		)
		.pipe(dest(path.build.html))
		.pipe(browserSync.reload({stream: true}))
}

function htmlMinify() {
	return src(path.src.html)
		.pipe(
			fileinclude({
				prefix: '@',
				basepath: '@file',
			})
		)
		.pipe(
			htmlmin({
				collapseWhitespace: true,
			})
		)
		.pipe(dest(path.build.html))
}

function cssMinify() {
	return src(path.src.css)
		.pipe(sass())
		.pipe(
			cleanCss({
				level: 2,
			})
		)
		.pipe(dest(path.build.css))
}

function jsMinify() {
	return src(path.src.js).pipe(uglify()).pipe(dest(path.build.js))
}

function imgMinify() {
	return src(path.src.img)
		.pipe(
			imagemin([
				imagemin.mozjpeg({
					quality: 80,
					progressive: true,
				}),
				imagemin.optipng({
					optimizationLevel: 2,
				}),
			])
		)
		.pipe(dest(path.build.img))
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
		.pipe(sass())
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
		.pipe(cssbeautify())
		.pipe(dest(path.build.css))
		.pipe(browserSync.reload({stream: true}))
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
		.pipe(browserSync.reload({stream: true}))
}

function img() {
	return src(path.src.img).pipe(dest(path.build.img))
}

function webpImg() {
	return src(path.src.img)
		.pipe(webp())
		.pipe(dest(distPath + 'assets/img/webp'))
		.pipe(browserSync.reload({stream: true}))
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
		.pipe(browserSync.reload({stream: true}))
}

function vendors() {
	return src(path.src.vendors)
		.pipe(dest(path.build.vendors))
		.pipe(browserSync.reload({stream: true}))
}

function fonts() {
	return src(path.src.fonts)
		.pipe(dest(path.build.fonts))
		.pipe(browserSync.reload({stream: true}))
}

// Other Tasks
function clean() {
	return del(path.clean)
}

function serve() {
	browserSync.init({
		server: {
			baseDir: distPath,
		},
	})
}

function prod(done) {
	!isProd
	done()
}

const dev = series(
	clean,
	parallel(html, css, js, img, webpImg, svg, vendors, fonts),
	serve
)
const build = series(
	clean,
	parallel(
		prod,
		htmlMinify,
		cssMinify,
		jsMinify,
		imgMinify,
		webpImg,
		svg,
		vendors,
		fonts
	)
)

function watchFiles() {
	watch([path.src.html], html)
	watch([path.src.css], css)
	watch([path.src.js], js)
	watch([path.src.img], img)
	watch([path.src.img], webp)
	watch([path.src.svg], svg)
	watch([path.src.vendors], vendors)
	watch([path.src.fonts], fonts)
}

const runParallel = parallel(dev, watchFiles)

exports.html = html
exports.css = css
exports.js = js
exports.img = img
exports.webpImg = webpImg
exports.svg = svg
exports.dev = dev
exports.vendors = vendors
exports.fonts = fonts
exports.build = build
exports.watchFiles = watchFiles

exports.default = runParallel
