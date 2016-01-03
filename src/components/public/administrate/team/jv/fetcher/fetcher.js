var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.jv.fetcher",{
			url: "/fetcher",
			templateUrl: "/templates/components/public/administrate/team/jv/fetcher/fetcher.html",
			controller: "FetcherController",
			
		})
}); 

app.controller("FetcherController", function ($scope, $localStorage, toastr, $state , Restangular) {
	$company_hash = Restangular.one('company/getCurrentCompanyHash').get().then(function(response){$scope.url = $scope.app.apiUrl + '/jvzoo/' + response;})

	$scope.init = function(){
	    var clipboard = new Clipboard('.copy-button');
	}

	$scope.copied = function()
	{
	    toastr.success("Link copied!");
	}
	$scope.init();
});