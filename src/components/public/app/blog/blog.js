var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.blog",{
			url: "/blog",
			templateUrl: "/templates/components/public/app/blog/blog.html",
			controller: "BlogController"
		})
}); 

app.controller( 'BlogController', function( $scope,$site, $rootScope, $localStorage, Restangular, notify )
{
	$scope.posts = [];
	$scope.loading=true;
	$rootScope.page_title = "Blogs";
	Restangular.all('').customGET('post?site_id='+$site.id ).then(function(response){
		$scope.loading=false;
		// $scope.posts = response;
		$.each(response, function (key, data) {
		           $scope.posts[key] = data;
		        });
	});
} );