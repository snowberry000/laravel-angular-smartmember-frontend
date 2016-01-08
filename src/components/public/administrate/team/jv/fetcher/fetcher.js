var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.jv.fetcher",{
			url: "/fetcher",
			templateUrl: "/templates/components/public/administrate/team/jv/fetcher/fetcher.html",
			controller: "FetcherController",
			
		})
}); 

app.controller("FetcherController", function ($scope, $rootScope, $localStorage, toastr, $state , Restangular) {

	$scope.init = function(){
	    var clipboard = new Clipboard('.copy-button');
	}

    $scope.url = $scope.app.apiUrl + '/jvzoo/' + $rootScope.site.hash;
    //console.log('here it is: ', $scope.url );

	$scope.copied = function()
	{
	    toastr.success("Link copied!");
	}
	$scope.init();
});