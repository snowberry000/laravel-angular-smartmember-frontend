var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("bridgepage",{
			url: "/bpage/:permalink",
			templateUrl: "/templates/components/bridgepage/bridgepage.html",
			controller: "BridgepageController"
		})
}); 

app.controller('BridgepageController', function ($scope, $localStorage, $interpolate, $state, $stateParams, $modal, $filter, Restangular, toastr, $location, $sce, $rootScope) {
    $scope.loading=true;
    Restangular.one('bridgePageByPermalink', $stateParams.permalink).get().then(function(response){
        $page=response;
        $scope.loading=false;
        $scope.bridgepage = $page;
        $rootScope.page_title = $scope.bridgepage.title;
        $scope.template = $scope.bridgepage.template;
        $scope.visible = false;
        $scope.data = {};
        var swapspot = {};
        var query_strings = $location.search();
        if (query_strings)
        {
            $.each(query_strings, function(key, data) {
                // swapspot[key] = data;
                $scope[key] = data;
            })
        }
        if ($page.swapspots)
        {
            $.each($page.swapspots, function (key, data) {
                swapspot[data.name] = ($interpolate(data.value)($scope))

            });
        }
        $scope.bridgepage.swapspot = swapspot;
        $scope.bridgepage.swapspot.optin_action = $sce.trustAsResourceUrl($scope.bridgepage.swapspot.optin_action);
    });
});