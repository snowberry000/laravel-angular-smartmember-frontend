var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.site",{
			url: "/site/:permalink",
			templateUrl: "/templates/components/public/www/site/site.html",
			controller: "WWWSiteController"
		})
}); 

app.controller("WWWSiteController", function ($scope) {

});