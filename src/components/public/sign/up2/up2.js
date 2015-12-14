var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.up2",{
			url: "/up",
			templateUrl: "/templates/components/public/sign/up2/up2.html"
		})
}); 

app.controller("Up2Controller", function ($scope) {

});