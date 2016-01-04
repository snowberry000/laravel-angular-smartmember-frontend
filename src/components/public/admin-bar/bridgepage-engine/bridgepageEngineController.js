app.controller( 'bridgepageEngineController', function( $scope, $localStorage, smModal, smSidebar, $q, $state, $stateParams, $filter, Restangular, toastr, Upload, $rootScope, $window, $sce )
{
	console.log( "Yup, here" );
	$scope.original_data = [];
	$rootScope.viewport = '';
	$scope.template = '';
	$scope.show_options = false;

	$scope.toggleSidebar = function()
	{
		smSidebar.Toggle('.left_bp_sidebar_contents');
		$scope.show_options = !$scope.show_options;
	}

	$scope.toggleViewPort = function( option )
	{
		if( $rootScope.viewport == option )
		{
			return;
		}
		$rootScope.viewport = option;
	}

	$scope.close = function()
	{
		smSidebar.Close();
		$rootScope.viewport = '';
	}

	$scope.$on( '$destroy', function()
	{
		console.log( $scope.original_data );

		$scope.destroyed = true;
		$state.transitionTo( $state.current, $stateParams, {
			reload: true, inherit: false, location: false
		} );
	} );
} );


app.controller( 'capIconThemeController', function( $rootScope, $scope, smSidebar, $state, $localStorage, $location, $stateParams, Restangular, toastr )
{
	$scope.updateIcon = function( $iconClass )
	{
		$rootScope.meta_data.cap_icon = $iconClass;
		console.log( $rootScope.meta_data );
	}
} );