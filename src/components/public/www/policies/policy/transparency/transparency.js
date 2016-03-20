var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.policy.transparency",{
			url: "/transparency",
			templateUrl: "/templates/components/public/www/policies/policy/transparency/transparency.html",
			controller: "PublicWWWPolicyTransparencyController"
		})
}); 

app.controller("PublicWWWPolicyTransparencyController", function ($scope) {

	$scope.SetTitle( 'Transparency Report' );
});