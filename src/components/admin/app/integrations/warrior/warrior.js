var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.integrations.warrior",{
			url: "/warrior",
			templateUrl: "/templates/components/admin/app/integrations/warrior/warrior.html",
			controller: "WarriorController"
		})
}); 

app.controller("WarriorController", function ($scope) {

});