var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.integrations.jvzoo",{
			url: "/jvzoo",
			templateUrl: "/templates/components/admin/app/integrations/jvzoo/jvzoo.html",
			controller: "JvzooController"
		})
}); 

app.controller("JvzooController", function ($scope) {

});