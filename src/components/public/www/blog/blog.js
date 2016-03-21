var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.blog",{
			url: "/somblog",
			templateUrl: "/templates/components/public/www/blog/blog.html",
			controller: "PublicWWWBlogController"
		})
}); 

app.controller("PublicWWWBlogController", function ($scope) {

});