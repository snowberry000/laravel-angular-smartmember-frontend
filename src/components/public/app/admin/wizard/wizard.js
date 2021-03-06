var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.wizard", {
			url: "/wizard/:id",
			templateUrl: "/templates/components/public/app/admin/wizard/wizard.html",
			controller: "WizardController"
		} )
        .state( "public.app.admin.wizard.list", {
            url: "/list",
            templateUrl: "/templates/components/public/app/admin/wizard/list.html",
            controller: "WizardController"
        } )
        .state( "public.app.admin.wizard.site_logo", {
            url: "/site_logo",
            templateUrl: "/templates/components/public/app/admin/wizard/nodes/upload_site_logo.html",
            controller: "siteLogoWizardController"
        } )
        .state( "public.app.admin.wizard.create_site_modules", {
            url: "/create_site_modules",
            templateUrl: "/templates/components/public/app/admin/wizard/nodes/create_site_modules.html",
            controller: "modulesWizardController"
        } )
        .state( "public.app.admin.wizard.create_site_lessons", {
            url: "/create_site_lessons",
            templateUrl: "/templates/components/public/app/admin/wizard/nodes/lesson_creation.html",
            controller: "lessonWizardController"
        } )
        .state( "public.app.admin.wizard.lock_site_content", {
            url: "/lock_site_content",
            templateUrl: "/templates/components/public/app/admin/wizard/nodes/lock_site_content.html",
            controller: "lockContentWizardController"
        } )
        .state( "public.app.admin.wizard.invite_members", {
            url: "/invite_members",
            templateUrl: "/templates/components/public/app/admin/wizard/nodes/invite_members.html",
            controller: "inviteMembersWizardController"
        } )
} );

app.controller( 'WizardController', function( $scope, smModal, $stateParams, $rootScope, $location, Wizards, $state, $filter, $http, $localStorage, Restangular, Nodes, toastr )
{
	$user = $rootScope.user;
	$site = $rootScope.site;
	$rootScope.wizard = [];
	$rootScope.wizard_server = [];
	$scope.wizard_loaded = false;

	console.log( "Wizards.GetCurrent( $stateParams.id )", $stateParams );
	$wizard = Wizards.GetCurrent( $stateParams.id );
	$nodes = Nodes.GetAll();
	$wizard_server = Restangular.all( 'wizard' ).customGET( '', {
		slug: $stateParams.id,
		site_id: $site ? $site.id : ''
	} ).then( function( response )
	{
		$scope.wizard_loaded = true;

		console.log( "THE WIZARD: ", $wizard );
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
			$http.defaults.headers.common[ 'subdomain' ] = $rootScope.site ? $rootScope.site.subdomain : '';

			//$rootScope.site = $site;

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
		

	} );

	$scope.cancel = function( node )
	{
		console.log( "cancel node: ", node, $rootScope.wizard_server, $scope );
		$state.go( 'public.app.admin.wizard.list', { id: $scope.static_wizard.slug } );
		if( node )
		{
			//node.HideBox( node );
		}
	}

	$scope.back = function()
	{
		//$state.go( 'public.administrate.wizards' );
		$state.go( 'public.app.admin.wizard.list', { id: 'site_launch_wizard' } );
		return;
	}

	$scope.skiplaststep = function()
	{
		$state.go( 'public.administrate.site.dashboard' );
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
				$state.go( 'public.app.admin.wizard.list', { id: 'site_launch_wizard' } );
				
				$rootScope.wizard_server = response;
				// alert(response.is_completed);
				if($rootScope.site && $rootScope.site.wizard_completed)
					$rootScope.site.wizard_completed.is_completed=response.is_completed;
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
				// alert(response.is_completed);
				if($rootScope.site && $rootScope.site.wizard_completed)
					$rootScope.site.wizard_completed.is_completed=response.is_completed;
				if( !params.is_completed )
				{
					$rootScope.current_changed = current + 1;
				}
				else
				{
					$scope.wizard_server.is_completed = true;
				}
				$rootScope.site.wizard_step++;
				$state.go( 'public.app.admin.wizard.list', { id: 'site_launch_wizard' } );
				var first_incomplete_step = _.findWhere( $rootScope.wizard, { completed: false } );

				if( first_incomplete_step )
				{
					$rootScope.current_changed = $rootScope.wizard.indexOf( first_incomplete_step );
				}
			} );
		}
	}

    $scope.nodeClickAction = function( node ) {
        var direct_link_nodes = [
            'create_new_site',
            'upload_site_logo'
        ];

        /*
        if( direct_link_nodes.indexOf( node.slug ) == -1 )
            smModal.Show('',{} , {'templateUrl' : node.template , 'controller' : node.controller});
        else
        */
            $state.go( node.state );
    }
} );
