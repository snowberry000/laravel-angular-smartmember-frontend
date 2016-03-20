var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.careers",{
			url: "/careers",
			templateUrl: "/templates/components/public/www/careers/careers.html",
			controller: "PublicWWWCareersController"
		})
}); 

app.controller("PublicWWWCareersController", function ($scope) {

});