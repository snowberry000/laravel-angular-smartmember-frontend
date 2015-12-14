var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("wallboard",{
			url: "/wallboard",
			templateUrl: "/templates/components/wallboard/wallboard.html",
			controller: "WallboardController",
			resolve: {
				$site: function( Restangular )
				{
					return Restangular.one( 'site', 'details' ).get();
				}
			}
		})
}); 

app.controller("WallboardController", function ($scope,$site, Restangular) {
	if(!$site.is_admin){
	    $state.go('admin.account.memberships');
	    return;
	}

	$scope.wallboard = {};
	$scope.loading = true;

	$scope.refreshData = function(){
	    Restangular.all( 'transaction' ).customGET( 'summary').then(function(response){
	        $scope.wallboard = response;
	        $scope.loading = false;
	    });
	}

	$scope.refreshData();

	var data_fetch = setInterval(function(){
	    $scope.refreshData();
	}, 30000);
});	