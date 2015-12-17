var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.content.blog",{
			url: "/blog",
			templateUrl: "/templates/components/public/admin/site/content/blog/blog.html",
			controller: "BlogController"
		})
}); 

app.controller("BlogController", function ($scope) {

});