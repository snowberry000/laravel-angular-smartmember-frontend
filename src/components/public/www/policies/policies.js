var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.policies",{
			url: "/policies",
			templateUrl: "/templates/components/public/www/policies/policies.html",
			controller: "PublicWWWpoliciesController"
		})
}); 

app.controller("PublicWWWpoliciesController", function ($scope) {

});