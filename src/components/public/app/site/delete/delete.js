var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site.delete",{
			url: "/delete",
			templateUrl: "/templates/components/public/app/site/delete/delete.html",
			controller: "DeleteController"
		})
}); 

app.controller('DeleteController', function ($scope, $rootScope , close ,$localStorage, $state, $stateParams,  Restangular, toastr, $filter) {
    $scope.cancel = function (result) {
        close(null , 200);
    };
    $scope.ok = function () {
        close($stateParams.id , 200);
    };
});