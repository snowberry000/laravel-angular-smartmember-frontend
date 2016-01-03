var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.site.content.blog",{
			url: "/blog",
			templateUrl: "/templates/components/public/administrate/site/content/blog/blog.html",
			controller: "SiteBlogController"
		})
}); 

app.controller("SiteBlogController", function ($scope) {

});