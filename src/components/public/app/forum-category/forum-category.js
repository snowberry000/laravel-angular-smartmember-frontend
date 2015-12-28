var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.forum-category",{
			url: "/forum-category/:permalink",
			templateUrl: "/templates/components/public/app/forum-category/forum-category.html",
			controller: "Forum-categoryController"
		})
}); 

app.controller("Forum-categoryController", function ($scope) {

});