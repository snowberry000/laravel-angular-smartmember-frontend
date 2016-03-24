var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.sign", {
			url: "/admin/sign",
			sticky: true,
			abstract: true,
			views: {
				'extra': {
					templateUrl: "/templates/components/admin/sign/sign.html"
				}
			}
		} )
} );

