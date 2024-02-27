//Подключение пакетов
const gulp = require('gulp');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();
// const sass = require('gulp-sass');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const cache = require('gulp-cache');
const sourcemaps = require('gulp-sourcemaps');
const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');


/* пути к исходным файлам (src), к готовым файлам (build) */
path = {
    build: {
        html: 'app/build/',
        style: 'app/build/assets/css/',
        js: 'app/build/assets/js/',
        img: 'app/build/assets/img/',
        fonts: 'app/build/assets/fonts/',
        plagins: 'app/build/assets/plagins/'
    },
    src: {
        html: 'app/project/*.html',
        style: 'app/project/src/scss/style.scss',
        js: 'app/project/src/js/main.js',
        img: 'app/project/src/img/**/*.*',
        fonts: 'app/project/src/fonts/**/*.*',
        plagins: 'app/project/src/plagins/**/*.*',
    },
    watch: {
        html: 'app/project/**/**/*.html',
        style: 'app/project/src/scss/**/*.scss',
        js: 'app/project/src/js/**/*.js',
        img: 'app/project/src/img/**/*.*',
        fonts: 'app/project/src/fonts/**/*.*',
        plagins: 'app/project/src/plagins/**/*.*',
    }
};


//Задачи для Gulp

// запуск сервера
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './app/build/'
        },
        // tunnel: true,
        host: 'localhost',
        port: 3000,
        logPrefix: "Frontend_Devil"
    });
});


// сбор html
gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});


// сбор стилей
gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            format: 'beautify',
            level: 0
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.style))
        .pipe(browserSync.stream())
        .pipe(cleanCSS({
            level: 2
        })) //Сожмем
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(path.build.style))
        .pipe(browserSync.stream());
});


// сбор js
gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify({
            toplevel: true
            }))
        .pipe(rename('main.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});


// обработка картинок
gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
});


// перенос шрифтов
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)//Выберем наши стили
        .pipe(gulp.dest(path.build.fonts)) //скопируем
});

// перенос плагинов
gulp.task('plagins:build', function() {
    gulp.src(path.src.plagins)//Выберем наши плагины
        .pipe(gulp.dest(path.build.plagins)) //скопируем
});


// сборка
gulp.task('build', gulp.series('html:build', 'style:build', 'js:build', 'image:build', 'fonts:build', 'plagins:build'));


// запуск задач при изменении файлов
gulp.task('watch', function(){
    watch(path.watch.html,gulp.series('html:build'));
    watch(path.watch.style,gulp.series('style:build'));
    watch(path.watch.js,gulp.series('js:build'));
    watch(path.watch.img,gulp.series('image:build'));
    watch(path.watch.fonts,gulp.series('fonts:build'));
    watch(path.watch.plagins,gulp.series('plagins:build'));
});


// Запуск основной задачи
gulp.task('default', 
gulp.parallel('browser-sync','build','watch'));



// очистка кэша
gulp.task('cache:clear', function () {
    cache.clearAll();
});