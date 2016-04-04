var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.email.settings", {
			url: "/settings",
			templateUrl: "/templates/components/public/app/admin/email/settings/settings.html",
			controller: "EmailSettingsController"
		} )
} );

app.controller( "EmailSettingsController", function( $scope, Upload, $rootScope, $localStorage, $location, Restangular, toastr )
{

	$scope.loading = true;
	$site = $rootScope.site;

	Restangular.all( 'emailSetting' ).customGET( 'settings' ).then( function( response )
	{
		console.log( response );
		$scope.emailSettings = response;
	} )


	$scope.save = function()
	{
		Restangular.one( 'emailSetting' ).post( "settings", $scope.emailSettings ).then( function( emailSettings )
		{
			toastr.success( "Your email settings have been saved!" );
		} );
	}
} );
