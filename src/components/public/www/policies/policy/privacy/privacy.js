var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.policy.privacy",{
			url: "/privacy",
			templateUrl: "/templates/components/public/www/policies/policy/privacy/privacy.html",
			controller: "PublicWWWPolicyPrivacyController"
		})
}); 

app.controller("PublicWWWPolicyPrivacyController", function ($scope) {

	$scope.SetTitle( 'Privacy Policy' );
});