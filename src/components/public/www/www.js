var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www",{
			views: {
				'base': {
					templateUrl: "/templates/components/public/www/www.html",
					controller: "WwwController"
				},
				'extra': {
					template: ""
				}
			}
		})
}); 

app.controller("WwwController", function ($scope,$location) {
	$scope.membership_sidebar = false;
	$scope.active_category = false;

	$scope.ToggleMembershipSidebar = function()
	{
		$scope.membership_sidebar = !$scope.membership_sidebar;
	};

	$scope.ShowMembershipSidebar = function()
	{
		return $scope.membership_sidebar;
	};

	$scope.SetActiveCategory = function( slug )
	{
		$scope.active_category = slug;
	};

	$scope.ResetActiveCategory = function()
	{
		//$scope.active_category = false;
	};

	$scope.GetActiveCategory = function()
	{
		return $scope.active_category;
	}

});