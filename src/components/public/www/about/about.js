var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.about",{
			url: "/about",
			templateUrl: "/templates/components/public/www/about/about.html",
			controller: "PublicWWWAboutController"
		})
}); 

app.controller("PublicWWWAboutController", function ($scope) {

});