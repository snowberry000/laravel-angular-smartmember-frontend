var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.site.wizard", {
			url: "/wizard/:id",
			templateUrl: "/templates/components/public/admin/site/wizard/wizard.html",
			controller: "WizardController"
		} )
} );

app.controller( 'WizardController', function( $scope, smModal, $stateParams, $rootScope, $location, Wizards, $state, $filter, $http, $localStorage, Restangular, Nodes, toastr )
{
	$user = $rootScope.user;
	$site = $rootScope.site;

	$wizard = Wizards.GetCurrent( $stateParams.id );
	$nodes = Nodes.GetAll();
	$wizard_server = Restangular.all( 'wizard' ).customGET( '', { slug: $stateParams.id, site_id: $site.id } ).then( function(response) {

		$scope.static_wizard = $wizard;
		$rootScope.wizard = [];

		if( $scope.static_wizard && $scope.static_wizard.nodes )
		{
			angular.forEach( $nodes, function( value, key )
			{
				if( $scope.static_wizard.nodes.indexOf( value.slug ) >= 0 )
				{
					$rootScope.wizard.push( value );
				}
			} )
		}

		$rootScope.wizard_server = response && response.length ? response[ 0 ] : { completed_nodes: [] };
		$rootScope.parent_wizard = $scope;
		$rootScope.$user = $user;
		$rootScope.current_changed = -1;
		$scope.wizard_completed = false;
		if( $scope.id == undefined )
		{
			$scope.id = 0;
			console.log( 'scope is reset' );
		}

		if( $rootScope.wizard_server )
		{
			$http.defaults.headers.common[ 'subdomain' ] = $rootScope.site.subdomain;

			$rootScope.site = $site;

			if( $rootScope.wizard_server.is_completed )
			{
				if( $rootScope.wizard_server.completed_nodes )
				{

					if( typeof $rootScope.wizard_server.completed_nodes == "string" )
					{
						$rootScope.wizard_server.completed_nodes = $rootScope.wizard_server.completed_nodes.split( ',' );
					}
					angular.forEach( $rootScope.wizard_server.completed_nodes, function( value, key )
					{
						var step = _.findWhere( $rootScope.wizard, { slug: value } );
						if( step )
						{
							step.completed = true;
						}
					} );
				}
				else
				{
					$rootScope.wizard_server.completed_nodes = [];
				}

				$scope.wizard_completed = true;
			}
			else
			{
				if( $rootScope.wizard_server.completed_nodes )
				{

					if( typeof $rootScope.wizard_server.completed_nodes == "string" )
					{
						$rootScope.wizard_server.completed_nodes = $rootScope.wizard_server.completed_nodes.split( ',' );
					}
					angular.forEach( $rootScope.wizard_server.completed_nodes, function( value, key )
					{
						var step = _.findWhere( $rootScope.wizard, { slug: value } );

						step.completed = true;
					} );
				}
				else
				{
					$rootScope.wizard_server.completed_nodes = [];
				}

				var first_incomplete_step = _.findWhere( $rootScope.wizard, { completed: false } );

				if( first_incomplete_step )
				{
					$scope.wizard_completed = false;
					$rootScope.current_changed = $rootScope.wizard.indexOf( first_incomplete_step );
				}
			}
		}

	});

	$scope.cancel = function( node )
	{
		if( node )
		{
			node.HideBox( node );
		}
	}

	$scope.back = function()
	{
		$state.go( 'public.admin.site.wizards' );
		return;
	}

	$scope.skiplaststep = function()
	{
		$state.go( 'public.admin.site.dashboard' );
	}

	$scope.next = function( current, node )
	{
		current = parseInt( current );
		console.log( 'Current node id is ', current );
		if( node )
		{
			//node.HideBox( node );
		}

		$http.defaults.headers.common[ 'subdomain' ] = $rootScope.site.subdomain;
		$rootScope.wizard[ current ].enabled = false;
		$rootScope.wizard[ current ].completed = true;
		var next = $rootScope.wizard[ current ];
		var params = { slug: $stateParams.id, site_id: $rootScope.site.id };

		if( !$rootScope.wizard_server.completed_nodes || typeof $rootScope.wizard_server.completed_nodes != 'object' )
		{
			$rootScope.wizard_server.completed_nodes = [];
		}

		if( $rootScope.wizard_server.completed_nodes.indexOf( $rootScope.wizard[ current ].slug ) == -1 )
		{
			$rootScope.wizard_server.completed_nodes.push( $rootScope.wizard[ current ].slug );
		}

		if( node.extras )
		{
			params.options = JSON.stringify( node.extras );
		}

		var completed_nodes = $rootScope.wizard_server.completed_nodes.join( ',' );

		params.completed_nodes = completed_nodes;

		var first_incomplete_step = _.findWhere( $rootScope.wizard, { completed: false } );

		if( !first_incomplete_step )
		{
			$scope.wizard_completed = true;
			$scope.is_new = true;
			params.is_completed = 1;
		}
		else
		{
			params.is_completed = 0;
		}

		if( $rootScope.wizard_server.id )
		{
			Restangular.all( "wizard" ).customPUT( params, $rootScope.wizard_server.id ).then( function( response )
			{
				smModal.Show('public.admin.site.wizard' , {id : 'site_launch_wizard'});
				$rootScope.wizard_server = response;
				/*if(response && response.options)
				 $rootScope.wizard_server.options = JSON.parse(response.options);*/
				$rootScope.site.wizard_step++;
				if( !params.is_completed )
				{
					$rootScope.current_changed = current + 1;
				}
				else
				{
					$scope.wizard_server.is_completed = true;
				}
				var first_incomplete_step = _.findWhere( $rootScope.wizard, { completed: false } );

				if( first_incomplete_step )
				{
					$rootScope.current_changed = $rootScope.wizard.indexOf( first_incomplete_step );
				}
			} )
		}
		else
		{
			Restangular.all( "wizard" ).post( params ).then( function( response )
			{
				if( !params.is_completed )
				{
					$rootScope.current_changed = current + 1;
				}
				else
				{
					$scope.wizard_server.is_completed = true;
				}
				$rootScope.site.wizard_step++;
				smModal.Show('public.admin.site.wizard' , {id : 'site_launch_wizard'});
				var first_incomplete_step = _.findWhere( $rootScope.wizard, { completed: false } );

				if( first_incomplete_step )
				{
					$rootScope.current_changed = $rootScope.wizard.indexOf( first_incomplete_step );
				}
			} );
		}


	}
} );
