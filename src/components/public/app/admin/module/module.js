var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.module", {
			url: "/module/:id?",
			templateUrl: "/templates/components/public/app/admin/module/module.html",
			controller: "ModuleController"
        } )
} );

app.controller( "ModuleController", function( $scope, smModal , $rootScope, $localStorage, $state, $stateParams,  Restangular, toastr )
{
    if( !$rootScope.site || $rootScope.site.capabilities.indexOf( 'manage_content' ) == -1 )
        $state.go('public.app.site.home');

	$scope.init=function(){
		if( !$module.id )
		{
			$module.site_id = $rootScope.site.id;
		}
		$scope.module = $module;
	}
	
	$site = $rootScope.site;
	$module=null;

	if( $stateParams.id )
	{
	    Restangular.one( 'module', $stateParams.id ).get().then(function(response){
	    	$module=response;
	    	$scope.init();
	    });
	}
	else
	{
		$module = { site_id: $site.id };
		$scope.init();
	}
	    

	
	
	

	$scope.range = function( min, max, step )
	{
		step = step || 1;
		var input = [];
		for( var i = min; i <= max; i += step ) input.push( i );
		return input;
	};

	$scope.save = function()
	{
		if( $scope.module.id )
		{
			$scope.module.put().then(function(response){
				$state.go('public.app.admin.modules');
				toastr.success( "Module has been updated!" );
			})
			if($stateParams.close){
				close($scope.module);
				return;
			}
		}
		else
		{
			Restangular.all( 'module' ).post( $scope.module ).then( function( module )
			{
				$scope.module = module;
				if($stateParams.close){
					close(module);
					return;
				}
				toastr.success( "Module has been saved" );
				$state.go('public.app.admin.modules');
			} );
		}
	}
} );