var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.pages.core.list", {
			url: "/list",
			templateUrl: "/templates/components/public/app/admin/pages/core/list/list.html",
			controller: "CoreController"
		} )
} );

app.controller( "ListController", function( $scope,$rootScope )
{
	
} );