var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.start", {
			url: "/start",
			views: {
				'base': {
					templateUrl: "/templates/components/admin/start/start.html",
					controller: "StartController",
				},
				'extra': {
					template: ""
				}
			}
		} )
} );

app.controller( "StartController", function( $scope, $http , Start , $localStorage , $state )
{
	if($localStorage.user && $localStorage.user.access_token){
		$state.go('admin.app.members');
		return;
	}

	if($state.current.name == 'admin.start'){
		$state.go('admin.start.email');
		return;
	}
	$http.get( 'json/product_details.json' ).success( function( response )
	{
		console.log( response );
		$scope.all_products = response.data;
	} );

} );