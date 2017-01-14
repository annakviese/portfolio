var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
	reload     = browserSync.reload,
    plumber = require('gulp-plumber'),
    eslint = require('gulp-eslint'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    notify = require('gulp-notify');

// const imagemin = require('gulp-imagemin');


var plumberErrorHandler={
    errorHandler: notify.onError({
      title: 'Gulp',
      message: 'Error: <%= error.message %>' //will see a notification if not able to compile sass file
    })
}; 


//uglify 

gulp.task('js', function(){ 
    gulp.src('./js/*.js')//these are the files that gulp will work with  (all of my .js files in js folder)
      .pipe(uglify())//uglify minifies the js files  .pipe allows to run miltiple methods 
      .pipe(rename({ extname: '.min.js' }))//changes the name and replaces .js to .min.js 
      .pipe(gulp.dest('./build/js')) //putting all the files in the new folder build
});


// SASS

gulp.task('sass', function() {
   gulp.src('./sass/base.scss')
      .pipe(plumber(plumberErrorHandler))
      .pipe(sass())
      .pipe(autoprefixer({
         browsers: ['last 2 versions']
      }))
      .pipe(gulp.dest('./build/css'))
      .pipe(cssnano())
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('./build/css'));
});

//Browser Sync
// Watch scss AND html files, doing different things with each.
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch(['build/css/*.css', "build/js/*.js"]).on('change', browserSync.reload);
});

//



gulp.task('default', function(){
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});


/**eslint*/

 
gulp.task('lint', function () {
  return gulp.src('./js/*js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('watch', function(){
    gulp.watch('js/*.js', ['js','lint']); //
    gulp.watch('sass/*.scss',['sass']);
});

gulp.task('default', ['watch', 'browserSync']);