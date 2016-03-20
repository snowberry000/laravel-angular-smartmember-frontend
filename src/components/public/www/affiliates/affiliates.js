var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.affiliates",{
			url: "/affiliates",
			templateUrl: "/templates/components/public/www/affiliates/affiliates.html",
			controller: "PublicWWWAffiliatesController"
		})
}); 

app.controller("PublicWWWAffiliatesController", function ($scope) {

});