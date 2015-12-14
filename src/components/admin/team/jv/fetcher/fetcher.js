var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.jv.fetcher",{
			url: "/fetcher",
			templateUrl: "/templates/components/admin/team/jv/fetcher/fetcher.html",
			controller: "FetcherController",
			resolve: {
				company_hash: function(Restangular){
					return Restangular.one('company/getCurrentCompanyHash').get();
				},
			}
		})
}); 

app.controller("FetcherController", function ($scope, $localStorage, toastr, $state, company_hash) {
	$scope.url = $scope.app.apiUrl + '/jvzoo/' + company_hash;

	$scope.init = function(){
	    var clipboard = new Clipboard('#copy-button');
	}

	$scope.copied = function()
	{
	    toastr.success("Link copied!");
	}
});