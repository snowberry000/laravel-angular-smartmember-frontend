var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www",{
			views: {
				'base': {
					templateUrl: "/templates/components/public/www/www.html",
					controller: "WwwController"
				},
				'extra': {
					template: ""
				}
			}
		})
}); 

app.controller("WwwController", function ($scope) {

});