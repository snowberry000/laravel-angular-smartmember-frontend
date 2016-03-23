var gulp = require( 'gulp' );
var angularFilesort = require( 'gulp-angular-filesort' )
var inject = require( 'gulp-inject' );
var bowerFiles = require( 'main-bower-files' );
var templateCache = require( 'gulp-angular-templatecache' );
var concat = require( 'gulp-concat' );
var ngAnnotate = require( 'gulp-ng-annotate' );
var minifyjs = require( 'gulp-uglify' );
var minifyhtml = require( 'gulp-minify-html' );
var minifycss = require( 'gulp-minify-css' );
var replace = require( 'gulp-replace-path' );
var less = require( 'gulp-less' );
var path = require( 'path' );
var exists = require( 'path-exists' ).sync;
var runSequence = require( 'run-sequence' );
var exec = require('child_process').exec;
//var protractor = require("gulp-protractor").protractor;
var shell = require('gulp-shell')


var config = {
	accessKeyId: "AKIAIYX347IAPYSI6HGQ",
	secretAccessKey: "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"
}

var s3 = require( 'gulp-s3-upload' )( config );

var paths = {
	less: 'src/**/*.less',
	js: 'src/**/*.js',
	templates: 'src/**/*.html',
	dist: 'dist',
	fonts: 'src/core/fonts/**/*',
	images: 'src/core/images/**/*',
	php: 'src/core/php/**/*',
	bpage: 'src/bpage_stuff_for_dist/**/*',
	json: 'src/core/json/*'
};



gulp.task( 'bower', function()
{
	gulp.src( bowerFiles( '**/*.js' ) )
		.pipe( concat( 'vendor.min.js' ) )
		.pipe( ngAnnotate() )
		.pipe( minifyjs( { mangle: false, output: { ascii_only: true } } ) )
		.pipe( gulp.dest( 'dist/js/' ) );

	gulp.src( bowerFiles( '**/*.css' ) )
		.pipe( concat( 'vendor.min.css' ) )
		.pipe( minifycss({processImport: false}) )
		.pipe( gulp.dest( 'dist/css/' ) );

	return true;
} );

gulp.task( 'js', function()
{
    gulp.src(["src/**/*.js","!src/bpage_stuff_for_dist/**","!src/e2e-tests/**", "!src/**/*.e2e.js", "!src/**/*.test.js"])
		.pipe( angularFilesort() )
		.pipe( ngAnnotate() )
		//.pipe( minifyjs() )
		.pipe( concat( 'main.min.js' ) )
		.pipe( gulp.dest( 'dist/js' ) );

	 //gulp.src(["src/**/*.e2e.js","!src/tests/*","!src/tests/**"])
		//.pipe( concat( 'e2e.tests.js' ) )
		//.pipe( gulp.dest( 'src/tests' ) );

	return true;
} );

//gulp.task( 'tests', function()
//{
	//gulp.src(["src/**/*.e2e.js","!src/tests/*","!src/tests/**"])
	//		.pipe( concat( 'e2e.tests.js' ) )
	//		.pipe( gulp.dest( 'src/tests' ) );

	//return true;
//} );


gulp.task( 'inject', function()
{
	var source = gulp.src( 'src/index.php' );

	var bowerMinFiles = bowerFiles().map( function( path, index, arr )
	{
		var newPath = path.replace( /.([^.]+)$/g, '.min.$1' );
		return exists( newPath ) ? newPath : path;
	} );

	return source
	/*.pipe(
	 inject(
	 gulp.src(bowerMinFiles)
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
	 )*/
		.pipe( gulp.dest( 'dist' ) );
} );

gulp.task( 'templates', function()
{
	return gulp.src( 'src/**/*.html' )
		.pipe( replace( "/core", "/tpl" ) )
		.pipe( gulp.dest( 'dist/templates' ) );
} );

gulp.task( 'test-e2e', shell.task([
	'protractor src/tests/e2e.conf.js'
]));


gulp.task( 'watch', function()
{
	gulp.watch( paths.js, [ 'js' ] );
	gulp.watch( paths.json, [ 'json' ] );
	gulp.watch( paths.less, [ 'less' ] );
	gulp.watch( paths.templates, [ 'templates' ] );
	gulp.watch( paths.fonts, [ 'fonts' ] );
	gulp.watch( paths.images, [ 'images' ] );
	gulp.watch( paths.php, [ 'php' ] );
	gulp.watch( paths.bpage, [ 'bpage' ] );
	gulp.watch( 'src/index.php', [] );
} );

/*
 Usage:
 gulp component -a admin.content.lesson
 gulp component -a admin
 gulp component -a admin.content
 */

gulp.task( 'component', function()
{
	var name = process.argv.slice( 3 )[ 1 ];
	var fs = require( 'fs' );
	var abs_path = name.split( '.' ).join( '/' );
	var dir = './src/components/' + abs_path;
	var url = name.split( "." ).pop();
	var controllerName = url.charAt( 0 ).toUpperCase() + url.slice( 1 )

	fs.mkdirSync( dir );
	fs.writeFileSync( dir + "/" + url + ".js", 'var app = angular.module("app");\n\napp.config(function($stateProvider){\n\t$stateProvider\n\t\t.state("' + name + '",{\n\t\t\turl: "/' + url + '",\n\t\t\ttemplateUrl: "/templates/components/' + abs_path + '/' + url + '.html",\n\t\t\tcontroller: "' + controllerName + 'Controller"\n\t\t})\n}); \n\napp.controller("' + controllerName + 'Controller", function ($scope) {\n\n});' );
	fs.writeFileSync( dir + "/" + url + ".html", '' );
	fs.writeFileSync( dir + "/" + url + ".less", '' );
} );

var path = require( 'path' );

gulp.task( 'less', function()
{

	return gulp.src( [
			'src/core/less/index.less',
			'src/components/**/*.less'
		] )
		//.pipe(concat('index.min.less'))
		.pipe( less( {
			strictMath: true
		} ) )
		.pipe( concat( 'main.min.css' ) )
		.pipe( minifycss({processImport: false}) )
		.pipe( gulp.dest( 'dist/css/' ) );


} );

gulp.task( 'bpage', function()
{
	return gulp.src( 'src/bpage_stuff_for_dist/**/*' )
		.pipe( gulp.dest( 'dist/' ) );

} );

gulp.task('crawler', function() {
	gulp.src('src/crawler.php')
		.pipe(gulp.dest('dist/'));
})

gulp.task( 'replace_vendor', function()
{
	return gulp.src( paths.dist + '/index.php' )
		.pipe( replace( '<script src="js/vendor.min.js"></script>', '<script src="https://smpub.s3.amazonaws.com/cdn/vendor.min.js"></script>' ) )
		.pipe( replace( '<script src="js/main.min.js"></script>', '<script src="https://smpub.s3.amazonaws.com/cdn/main.min.js"></script>' ) )
		.pipe( replace( '<link rel="stylesheet" href="css/vendor.min.css">', '<link rel="stylesheet" href="https://smpub.s3.amazonaws.com/cdn/vendor.min.css">' ) )
		.pipe( replace( '<script src="bower/ui-iconpicker/dist/scripts/ui-iconpicker.min.js"></script>', '<script src="//my.smartmember.com/bower/ui-iconpicker/dist/scripts/ui-iconpicker.min.js"></script>' ) )
		.pipe( replace( '<script src="bower/slimScroll/jquery.slimscroll.min.js"></script>', '<script src="//my.smartmember.com/bower/slimScroll/jquery.slimscroll.min.js"></script>' ) )
		.pipe( replace( '<link rel="stylesheet" href="bower/footable/css/footable.core.css">', '<link rel="stylesheet" href="//my.smartmember.com/bower/footable/css/footable.core.css">' ) )
		.pipe( replace( '<link rel="stylesheet" href="css/main.min.css">', '<link rel="stylesheet" href="//my.smartmember.com/css/main.min.css">' ) )
		.pipe( gulp.dest( paths.dist + '/' ) );
} );

gulp.task( "upload", function()
{ 
	return gulp.src( [ "dist/js/vendor.min.js", "dist/css/vendor.min.css", "dist/js/main.min.js" ] )
		.pipe( s3( {
			Bucket: '/smpub/cdn', //  Required
			ACL: 'public-read'
		}, {
			// S3 Construcor Options, ie:
			maxRetries: 5
		} ) );
} );

gulp.task( 'fonts', function()
{
	return gulp.src( paths.fonts )
		.pipe( gulp.dest( 'dist/fonts/' ) );
} );

gulp.task( 'json', function()
{
	return gulp.src( paths.json )
		.pipe( gulp.dest( 'dist/json/' ) );
} );

gulp.task( 'images', function()
{
	return gulp.src( paths.images )
		.pipe( gulp.dest( 'dist/images/' ) );
} );

gulp.task( 'php', function()
{
	return gulp.src( paths.php )
		.pipe( gulp.dest( 'dist/php/' ) );
} );

gulp.task( 'compile', [ 'inject', 'bower', 'js', 'templates', 'less', 'images', 'php', 'fonts', 'bpage', 'crawler' ,'json'] );
gulp.task( 'default', [ 'inject', 'bower', 'js', 'templates', 'less', 'images', 'php', 'fonts', 'bpage','crawler' ,'json', 'watch'] );
gulp.task( 'test', [ 'test-e2e'] );

gulp.task( 'production', [ 'compile'], function()
{
	runSequence( 'replace_vendor', function()
	{
		exec('gulp upload', function (err, stdout, stderr) {
		    console.log(stdout);
		    console.log(stderr);
		});
	} );
} );



