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

	$scope.imageUpload = function( files )
	{

		for( var i = 0; i < files.length; i++ )
		{
			var file = files[ i ];
			Upload.upload( {
					url: $scope.app.apiUrl + '/utility/upload',
					file: file
				} )
				.success( function( data, status, headers, config )
				{
					console.log( data.file_name );
					var editor = $.summernote.eventHandler.getModule();
					file_location = '/uploads/' + data.file_name;
					editor.insertImage( $scope.editable, data.file_name );
				} ).error( function( data, status, headers, config )
			{
				//console.log('error status: ' + status);
			} );
		}
		for( var i = 0; i < files.length; i++ )
		{
			var file = files[ i ];
			Upload.upload( {
					url: $scope.app.apiUrl + '/utility/upload',
					file: file
				} )
				.success( function( data, status, headers, config )
				{
					console.log( data.file_name );
					var editor = $.summernote.eventHandler.getModule();
					file_location = '/uploads/' + data.file_name;
					editor.insertImage( $scope.editable, data.file_name );
				} ).error( function( data, status, headers, config )
			{
				console.log( 'error status: ' + status );
			} );
		}
	}

	$scope.save = function()
	{
		Restangular.one( 'emailSetting' ).post( "settings", $scope.emailSettings ).then( function( emailSettings )
		{
			toastr.success( "Your email settings have been saved!" );
		} );
	}
} );
