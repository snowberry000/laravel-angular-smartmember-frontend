var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.soon",{
			url: "/soon",
			templateUrl: "/templates/components/public/www/soon/soon.html",
			controller: "PublicWWWSoonController"
		})
}); 

app.controller("PublicWWWSoonController", function ($scope) {

});