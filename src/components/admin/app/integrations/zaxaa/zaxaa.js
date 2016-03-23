var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.integrations.zaxaa",{
			url: "/zaxaa",
			templateUrl: "/templates/components/admin/app/integrations/zaxaa/zaxaa.html",
			controller: "ZaxaaController"
		})
}); 

app.controller("ZaxaaController", function ($scope) {

});