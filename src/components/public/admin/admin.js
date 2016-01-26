var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin", {
			sticky: true,
			abstract: true,
			url: "/admin",
			views: {
				'admin': {
					templateUrl: "/templates/components/public/admin/admin.html",
					controller: "PublicAdminController"
				}
			}
		} )
} );

app.controller( 'PublicAdminController', function( $scope )
{

} );
