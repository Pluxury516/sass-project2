const {src, dest, parallel, series, watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin-fix');
const webp = require("gulp-webp");
const imageminWebp = require ("imagemin-webp");
const gutil = require("gulp-util");
const ftp = require ("vinyl-ftp")

const styles = () => {
	return src('./src/sass/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', notify.onError()))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./dist/css/'))
		.pipe(browserSync.stream());
}


const imgToApp = () => {
	return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
   .pipe(
      webp({
         quality:70
      })
   )
   .pipe(
      imagemin([
          imageminWebp({
              quality: [50],
          }),
          imagemin.svgo(),
      ]),
  )
		.pipe(dest('./dist/img'))
}

const htmlInclude = () => {
	return src(['./src/index.html'])
		.pipe(fileinclude({
			prefix: '@',
			basepath: '@file'
		}))
		.pipe(dest('./dist'))
		.pipe(browserSync.stream());
}

const clean = () => {
   return del(['dist/*'])
}

const scripts = () => {
	return src('./src/js/**/*.js') 
		.pipe(webpackStream({
			mode: 'development',
			output: {
				filename: 'main.js',
			},
			module: {
				rules: [{
					test: /\.m?js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}]
			},
		}))
		.on('error', function (err) {
			console.error('WEBPACK ERROR', err);
			this.emit('end'); // Don't stop the rest of the task
		})

		.pipe(sourcemaps.init())
		.pipe(uglify().on("error", notify.onError()))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./dist/js'))
		.pipe(browserSync.stream());
}

const watchFiles = () => {
	browserSync.init({
		server: {
			baseDir: "./src"
		}
	});

	watch('./src/sass/**/*.scss', styles);
	watch('./src/index.html', htmlInclude);
   watch('./src/img/**.jpg', imgToApp);
   watch('./src/img/**.png', imgToApp);
   watch('./src/img/**.jpeg', imgToApp);
   watch('./src/js/**/*.js', scripts);

   }


   
exports.styles = styles;
exports.watchFiles = watchFiles;
exports.fileinclude = htmlInclude;
exports.default = series( clean, parallel (htmlInclude, scripts, imgToApp,), styles, watchFiles);


// Build version
const scriptsBuild = () => {
	return src('./src/js/**/*.js') 
		.pipe(webpackStream({
			mode: 'development',
			output: {
				filename: 'main.js',
			},
			module: {
				rules: [{
					test: /\.m?js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}]
			},
		}))
		.on('error', function (err) {
			console.error('WEBPACK ERROR', err);
			this.emit('end'); // Don't stop the rest of the task
		})

		.pipe(uglify().on("error", notify.onError()))
		.pipe(dest('./dist/js'))
}

const stylesBuild = () => {
	return src('./src/sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', notify.onError()))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(dest('./dist/css/'))
}

exports.build = series( clean, parallel (htmlInclude, scriptsBuild, imgToApp,), stylesBuild,);



// deploy version
const deploy = () => {
	let conn = ftp.create({
		host: '',
		user: '',
		password: '',
		parallel: 10,
		log: gutil.log
	});

	let globs = [
		'dist/**',
	];

	return src(globs, {
			base: './dist',
			buffer: false
		})
		.pipe(conn.newer('')) // only upload newer files
		.pipe(conn.dest(''));
}

exports.deploy = deploy;