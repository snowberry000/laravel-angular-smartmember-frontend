var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("my.resource",{
			url: "/resource",
			templateUrl: "/templates/components/my/resource/resource.html",
			controller: "ResourceController"
		})
}); 

app.controller("ResourceController", function ($scope) {

});