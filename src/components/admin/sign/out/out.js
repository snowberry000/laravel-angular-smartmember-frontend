var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.sign.out", {
			url: "/out",
			controller: function( $state, User )
			{
				User.signOut();
			}
		} )
} );
