var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.sign", {
			url: "/sign",
			sticky: true,
			abstract: true,
			views: {
				'extra': {
					templateUrl: "/templates/components/public/sign/sign.html"
				}
			}
		} )
} );

