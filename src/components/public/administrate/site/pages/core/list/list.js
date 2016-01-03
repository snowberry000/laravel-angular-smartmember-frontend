var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.site.pages.core.list", {
			url: "/list",
			templateUrl: "/templates/components/public/administrate/site/pages/core/list/list.html",
			controller: "CoreController"
		} )
} );

app.controller( "ListController", function( $scope )
{

} );