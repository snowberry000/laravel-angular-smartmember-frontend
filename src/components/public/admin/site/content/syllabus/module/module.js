var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.site.content.syllabus.module", {
			url: "/module/:id?",
			templateUrl: "/templates/components/public/admin/site/content/syllabus/module/module.html",
			controller: "ModuleController",
			resolve: {
				$module: function( Restangular, $site, $stateParams )
				{
                    if( $stateParams.id )
                    {
                        return Restangular.one( 'module', $stateParams.id ).get();
                    }
                    else
                        return { site_id: $site.id }
                }
            }
        } )
} );

app.controller( "ModuleController", function( $scope, $rootScope, $localStorage, $module, $state, $site, $stateParams, $modal, Restangular, toastr )
{
	if( !$module.id )
	{
		$module.site_id = $rootScope.site.id;
	}
	$site = $rootScope.site;

	$scope.module = $module;

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
			$scope.module.put();
			$state.go( "public.admin.site.content.syllabus.modules" );
			toastr.success( "Module has been updated!" );
		}
		else
		{
			Restangular.all( 'module' ).post( $scope.module ).then( function( module )
			{
				$scope.module = module;
				toastr.success( "Module has been saved" );
				$state.go( "public.admin.site.content.syllabus.modules" );
			} );
		}
	}
} );