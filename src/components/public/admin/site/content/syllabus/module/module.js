var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.site.content.syllabus.module", {
			url: "/module/:id?",
			templateUrl: "/templates/components/public/admin/site/content/syllabus/module/module.html",
			controller: "ModuleController"
        } )
} );

app.controller( "ModuleController", function( $scope, smModal, $rootScope, $localStorage, $state, $stateParams,  Restangular, toastr )
{

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
			$scope.module.put();
			smModal.Show('public.admin.site.content.syllabus.modules');
			toastr.success( "Module has been updated!" );
		}
		else
		{
			Restangular.all( 'module' ).post( $scope.module ).then( function( module )
			{
				$scope.module = module;
				toastr.success( "Module has been saved" );
				smModal.Show('public.admin.site.content.syllabus.modules');
			} );
		}
	}
} );