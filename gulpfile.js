//geral
const gulp = require('gulp')
const browserSync = require('browser-sync')
const clean = require('gulp-clean')
//style
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const csslint = require('gulp-csslint')
//html
const pug = require('gulp-pug');
//image
const imagemin = require('gulp-imagemin')

gulp.task('default', ['clean'], () => {//dependencia da tarefa clean
    //todas vão ser execultadas ao mesmo tempo, já que não tem dependencia entre elas
    gulp.start('pug', 'css','build-image')
})

//para remover a pasta dist
gulp.task('clean', () => {
    console.log('clear executado')
    return gulp.src('dist')
        .pipe(clean({read: false,force: true}))
})

gulp.task('build-image', function () {
    console.log('build image executada')
    gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
})

gulp.task('pug', () => {
    console.log('pug executada')
    return gulp.src('src/views/*.pug')
        .pipe(pug({
            doctype: 'html',
            pretty: false
        }))
        .pipe(gulp.dest('dist'))
})

gulp.task('css', ['sass'], () => {
    console.log('css executada')
    gulp.src('src/css/**/*.css')
        .pipe(autoprefixer('last 2 versions'))
        .pipe(csslint())
        .pipe(csslint.reporter())
        .pipe(gulp.dest('dist/css'))
})

gulp.task('sass', () => {
    console.log('sass executada')
    return gulp.src('src/sass/main.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('src/css'));
})

//ele cria um pequeno servidor
gulp.task('server', () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });

    gulp.watch('src/**/*').on('change', browserSync.reload);

    gulp.watch('src/img/**/*').on('change', () => {
        gulp.start('build-image')
    });

    gulp.watch('src/css/**/*.css').on('change', () => {
        gulp.start('css')
    });

    gulp.watch('src/sass/*.scss').on('change', () => {
        gulp.start('css')
    });

    gulp.watch('src/views/*.pug').on('change', () => {
        gulp.start('pug')
    });
})