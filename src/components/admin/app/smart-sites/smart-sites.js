var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.smart-sites", {
			url: "/smart-sites",
			redirectTo: 'admin.app.smart-sites.list',
			templateUrl: "/templates/components/admin/app/smart-sites/smart-sites.html",
			controller: "SmartSitesController"
		} )
} );

app.controller( "SmartSitesController", function( $scope, $rootScope, $filter, $localStorage, toastr, $location, Restangular, $state, notify )
{
	$rootScope.page_title = "Smart Sites";

	$rootScope.current_editing_site = '';

} );