var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.policy",{
			url: "/policy",
			templateUrl: "/templates/components/public/www/policies/policy/policy.html",
			controller: "PublicWWWPolicyController"
		})
}); 

app.controller("PublicWWWPolicyController", function ($scope) {

	$scope.title = '';

	$scope.SetTitle = function( next_value )
	{
		$scope.title = next_value;
	}
});