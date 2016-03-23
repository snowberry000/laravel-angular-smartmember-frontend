var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider.state( "admin.app.smart-sites.settings", {
		url: '/settings/:subdomain',
		redirectTo: 'admin.app.smart-sites.settings.general',
		templateUrl: '/templates/components/admin/app/smart-sites/settings/settings.html',
		controller: 'AdminAppSmartSitesSettingsController'
	} )
} );

app.controller( 'AdminAppSmartSitesSettingsController', function( $scope, $localStorage, RestangularV3, toastr, smModal )
{
	$scope.active_settings_group = 'general';

	$scope.SetActiveSettingsGroup = function( slug )
	{
		$scope.active_settings_group = slug;
	};

} );
