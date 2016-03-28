var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.start.verify",{
			url: "/verify",
			templateUrl: "/templates/components/admin/start/javascript/verify/verify.html",
			controller: "AdminAppStartJavascriptVerifyController"
		})
}); 

app.controller("AdminAppStartJavascriptVerifyController", function ($scope) {

});