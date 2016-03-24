var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.sign.forgot", {
			url: "/forgot",
			templateUrl: "/templates/components/admin/sign/forgot/forgot.html",
			controller: 'ResetController'
		} )
} );

app.controller( 'ResetController', function( $rootScope, $scope, $localStorage, $stateParams, $location, RestangularV3 , Restangular, $state, $http, toastr )
{
	var auth = RestangularV3.all( 'auth' );
	$rootScope.is_admin = true;
	$rootScope.page_title = "Smartmember - Password Reset";
	$scope.data = {};
	if( $location.search().error_message )
	{
		if( $location.search().error_message == "inprocess registration" )
		{
			$scope.inprocess_register = true;
		}
	}

	if( $rootScope.$_GET[ 'reset_hash' ] )
	{
		$scope.hash = $rootScope.$_GET[ 'reset_hash' ];
	}

	$scope.reset = function( password )
	{	
		$scope.email_status = 'false';
		
		auth.customPOST( { reset_token: $scope.hash, password: password }, 'reset' ).then( function( data )
		{
			if( data.message && data.message == "no such email found" )
			{
				toastr.error( "The email you specified does not exist" );
			}
			else
			{
				$scope.message = data.message;
				$scope.email_status = 'sent';
			}

		} );
	}

	$scope.forgot = function( reset_email )
	{
		$scope.email_status = 'false';

		auth.customPOST( { email: $scope.data.reset_email }, 'forgot' ).then( function( data )
		{
			if( data.message && data.message == "no such email found" )
			{
				toastr.error( "The email you specified does not exist" );
			}
			else
			{
				//( 'admin.sign.in', { reset: 1 } );
				$scope.email_status = 'sent'; // what is reset:1 for above?
				$scope.message = data.message;
			}
		} );
	}

	$scope.init = function()
	{
		$scope.hash = $stateParams.hash;
	}

} );