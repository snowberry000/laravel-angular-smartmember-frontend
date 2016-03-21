var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.policy.data",{
			url: "/data",
			templateUrl: "/templates/components/public/www/policies/policy/data/data.html",
			controller: "PublicWWWPolicyDataController"
		})
}); 

app.controller("PublicWWWPolicyDataController", function ($scope) {

	$scope.SetTitle( 'User Data Request Policy' );
});