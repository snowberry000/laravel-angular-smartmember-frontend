var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.policy.tos",{
			url: "/tos",
			templateUrl: "/templates/components/public/www/policies/policy/tos/tos.html",
			controller: "PublicWWWPolicyTosController"
		})
}); 

app.controller("PublicWWWPolicyTosController", function ($scope) {

	$scope.SetTitle( 'Terms of Service' );
});