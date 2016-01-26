var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.pages.jv",{
			url: "/jv",
			templateUrl: "/templates/components/public/app/admin/pages/core/jv/jv.html",
			controller: "adminJVPageController"
		})
}); 

app.controller("JvController", function ($scope) {

});