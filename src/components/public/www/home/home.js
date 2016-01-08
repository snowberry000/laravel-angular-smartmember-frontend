var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.home",{
			templateUrl: "/templates/components/public/www/home/home.html",
			controller: "WwwHomeController"
		})
}); 

app.controller("WwwHomeController", function ($scope, Restangular) {

	Restangular.all('directory').getList().then(function (data) {
		//console.log( 'the data', data );
		$scope.site_listings = data;
	});

});