var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site.blog",{
			url: "/blog",
			templateUrl: "/templates/components/public/app/site/blog/blog.html",
			controller: "BlogController"
		})
}); 

app.controller( 'BlogController', function( $scope,$site, $rootScope, $localStorage, Restangular, notify )
{
	$scope.posts = [];
	$scope.loading=true;
	$rootScope.page_title = "Blogs";
	Restangular.all( 'post' ).getList( { 'site_id': $site.id } ).then( function( response )
	{
		$scope.loading=false;
		$scope.posts = response;
	} );
} );