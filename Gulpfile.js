var gulp = require('gulp');
var angularFilesort = require('gulp-angular-filesort')
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var minifyjs = require('gulp-uglify');
var minifyhtml = require('gulp-minify-html');
var replace = require('gulp-replace-path');
var less = require('gulp-less');
var path = require('path');

var paths = {
	less: 'src/**/*.less',
	js: 'src/**/*.js',
	templates: 'src/**/*.html',
	fonts: 'src/core/fonts/**/*'
};

gulp.task('bower', function(){
	gulp.src(bowerFiles('**/*.js'))
        //.pipe(concat('library.min.js'))
        .pipe(ngAnnotate())
        //.pipe(minifyjs({ mangle: false }))
        .pipe(gulp.dest('dist/js/vendors'));

    gulp.src(bowerFiles('**/*.css'))
        .pipe(concat('library.min.css'))
        .pipe(gulp.dest('dist/css/'));

    return true;
});

gulp.task('js', function(){
	 return gulp.src("src/**/*.js")
	 	.pipe(angularFilesort())
        .pipe(ngAnnotate())
        //.pipe(minifyjs())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('inject',function(){
	var source = gulp.src('src/index.php');
	return source
		.pipe(
			inject(
				gulp.src(bowerFiles())
				,
					{
						read: false, 
						name: 'bower',
						transform: function (filepath) {
							filepath = filepath.slice(6);
					        return inject.transform.apply(inject.transform, arguments);
					    }
					}
				)
			)
		.pipe(gulp.dest('dist'));
});

gulp.task('templates', function() {
    return gulp.src('src/**/*.html')
    	.pipe(replace("/core","/tpl"))
        .pipe(gulp.dest('dist/templates'));
});

gulp.task('img',function(){
	return gulp.src('src/core/img/*')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function() {
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.less, ['less']);
    gulp.watch(paths.templates, ['templates']);
    gulp.watch(paths.fonts, ['fonts']);
    gulp.watch('src/index.php', ['inject']);
});

/*
	Usage:
	gulp component -a admin.content.lesson
	gulp component -a admin
	gulp component -a admin.content
*/

gulp.task('component', function(){
	var name = process.argv.slice(3)[1];
	var fs = require('fs');
	var abs_path = name.split('.').join('/');
	var dir = './src/components/' + abs_path ;
	var url = name.split(".").pop();
	var controllerName = url.charAt(0).toUpperCase() + url.slice(1)

	fs.mkdirSync(dir);
	fs.writeFileSync(dir + "/" + url + ".js",'var app = angular.module("app");\n\napp.config(function($stateProvider){\n\t$stateProvider\n\t\t.state("'+ name + '",{\n\t\t\turl: "/' + url +'",\n\t\t\ttemplateUrl: "/templates/components/' + abs_path + '/' + url + '.html",\n\t\t\tcontroller: "'+ controllerName + 'Controller"\n\t\t})\n}); \n\napp.controller("' + controllerName + 'Controller", function ($scope) {\n\n});');
	fs.writeFileSync(dir + "/" + url + ".html",'');
	fs.writeFileSync(dir + "/" + url + ".less",'');
});

var path = require('path');

gulp.task('less', function () {

  return gulp.src(['src/core/less/main.less','src/components/**/*.less'])
  	.pipe(concat('src/core/less/main.min.less'))
    .pipe(less(
    	{
    		paths: [path.join('src/core/less/')]
    	}
    ))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('fonts', function () {
	return gulp.src(paths.fonts)
		.pipe(gulp.dest('dist/fonts/'));
});

gulp.task('bpage', function () {

	return gulp.src('src/bpage_stuff_for_dist/**/*')
		.pipe(gulp.dest('dist/'));

});


gulp.task('compile',['inject','js','templates','less','img','bpage','fonts']);
gulp.task('default',['inject','js','templates','less','img','bpage','fonts','watch']);



