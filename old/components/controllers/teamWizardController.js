app.controller('teamWizardsController', function ($scope, $rootScope , $location , $state , $site , $filter , $http ,$user , $localStorage, $modal, Restangular,$wizards, $wizards_server , toastr) {
    $rootScope.wizards = $wizards;
    $rootScope.wizards_server = $wizards_server;
    //$rootScope.parent_wizard = $scope;
    var wizards = _.pluck($wizards_server , 'slug');
    if(wizards && $rootScope.wizards){
        angular.forEach($rootScope.wizards , function(value , key){
            if(wizards.indexOf(value.slug) >= 0){
                value.completed = true;
            }
        })
    }
    

    $scope.open = function(wizard){
        $state.go('admin.team.wizard' , {'id' : wizard.slug});
    }
});

app.controller( 'teamWizardController', function( $scope, $rootScope, $location,$stateParams, $filter, $state, $company, $http, $user, $localStorage, $modal, Restangular, $wizard, $nodes , $wizard_server ,toastr )
{
	$scope.static_wizard = $wizard;
    $rootScope.wizard = [];

    if($scope.static_wizard && $scope.static_wizard.nodes){
        angular.forEach($nodes , function(value , key){
            if($scope.static_wizard.nodes.indexOf(value.slug) >= 0)
                $rootScope.wizard.push(value);
        })
    }

    $rootScope.wizard_server = $wizard_server && $wizard_server.length ? $wizard_server[0] : {completed_nodes : []} ;

	$rootScope.parent_wizard = $scope;
	$rootScope.$user = $user;
	$rootScope.current_company_changed = -1;
	$scope.wizard_completed = false;
	$scope.id = 0;
	if( $rootScope.wizard_server )
	{
		$rootScope.company = _.find( $company.companies, { selected: 1 } );

		if( $rootScope.wizard_server.is_completed )
		{
            if( $rootScope.wizard_server.completed_nodes ) {
            	if(typeof $rootScope.wizard_server.completed_nodes == "string")
                	$rootScope.wizard_server.completed_nodes = $rootScope.wizard_server.completed_nodes.split(',');
                angular.forEach($rootScope.wizard_server.completed_nodes, function (value, key) {
                    var step = _.findWhere($rootScope.wizard, {slug: value});
                    if( step )
                        step.completed = true;
                });

                $scope.wizard_completed = true;
            }
            else
            {
                $rootScope.wizard_server.completed_nodes = [];
            }
		}
		else
		{
            if( $rootScope.wizard_server.completed_nodes ) {
            	if(typeof $rootScope.wizard_server.completed_nodes == "string")
                	$rootScope.wizard_server.completed_nodes = $rootScope.wizard_server.completed_nodes.split(',');
                angular.forEach( $rootScope.wizard_server.completed_nodes, function( value, key ){
                    var step = _.findWhere( $rootScope.wizard, {slug: value} );

                    step.completed = true;
                } );
            }
            else
            {
                $rootScope.wizard_server.completed_nodes = [];
            }

            var first_incomplete_step = _.findWhere( $rootScope.wizard, {completed: false} );

			if( first_incomplete_step )
			{
				$scope.wizard_completed = false;
				$rootScope.current_changed = $rootScope.wizard.indexOf( first_incomplete_step );
			}
		}

	}

	$scope.cancel = function(node){
        if(node){
            node.HideBox(node);
        }
    }

    $scope.back = function(){
        $state.go('admin.team.wizards');
        return;
    }

	$scope.next = function( current, node, redirect_url )
	{
		current = parseInt( current );

		if( node )
		{
			console.log(node)
			node.HideBox( node );
		}
		$rootScope.wizard[ current ].completed = true;
		var next = $rootScope.wizard[ current ];
		var params = {slug : $stateParams.id , company_id : $rootScope.company.id};

        if( !$rootScope.wizard_server.completed_nodes || typeof $rootScope.wizard_server.completed_nodes != 'object' )
            $rootScope.wizard_server.completed_nodes = [];

        if( $rootScope.wizard_server.completed_nodes.indexOf( $rootScope.wizard[ current ].slug ) == -1 ){
            $rootScope.wizard_server.completed_nodes.push( $rootScope.wizard[ current ].slug );
        }

        var completed_nodes = $rootScope.wizard_server.completed_nodes.join(',');

        params.completed_nodes = completed_nodes;

        var first_incomplete_step = _.findWhere( $rootScope.wizard, {completed: false} );

		if( !first_incomplete_step )
		{
			$scope.wizard_completed = true;
			params.is_completed = 1;
		}
		else
		{
			params.is_completed = 0;
		}

		if($rootScope.wizard_server.id){
            Restangular.all("wizard").customPUT( params , $rootScope.wizard_server.id).then( function( response ){
            if(!params.is_completed){
                $rootScope.current_changed = current + 1;
            }else{
                $scope.wizard_server.is_completed = true;
            }
            var first_incomplete_step = _.findWhere( $rootScope.wizard, {completed: false} );

            if( first_incomplete_step )
            {
                $rootScope.current_changed = $rootScope.wizard.indexOf( first_incomplete_step );
            }
				if (redirect_url != undefined)
					window.location.href = redirect_url;
            })
        }else{
            Restangular.all("wizard").post( params).then( function( response ) {
            if(!params.is_completed){
                $rootScope.current_changed = current + 1;
            }else{
                $scope.wizard_server.is_completed = true;
            }
            var first_incomplete_step = _.findWhere( $rootScope.wizard, {completed: false} );

            if( first_incomplete_step )
            {
                $rootScope.current_changed = $rootScope.wizard.indexOf( first_incomplete_step );
            }
				if (redirect_url != undefined)
					window.location.href = redirect_url;
        });
        }
	}
} );

app.controller( 'teamNameWizardController', function( $scope, $state, $rootScope, $filter, $http, $localStorage, $modal, Restangular, toastr )
{
	$scope.current_node = $scope.$parent;
	/*$rootScope.$watch( 'current_company_changed', function( company )
	{
		if( $rootScope.current_company_changed == $scope.current_node.id && $rootScope.company.name && $rootScope.company.progress != 0 && parseInt( $rootScope.company.is_completed ) == 0 )
		{
			$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
		}
	} )*/

	$scope.save = function()
	{
		$scope.saving = true;
		if( !$scope.company )
		{
			return;
		}
		Restangular.all( 'company' ).customPUT( { name: $scope.company.name }, $scope.company.id ).then( function( response )
		{
			toastr.success('Company name successfully updated');
			$scope.company = response;
			$rootScope.current_company = $scope.company;
			$rootScope.parent_wizard.next( 0, $scope.current_node );
			$scope.saving = false;
		} )
	}
} );

app.controller( 'teamBioWizardController', function( $scope, $state, $rootScope, $filter, $http, $localStorage, $modal, Restangular, toastr )
{
	$scope.current_node = $scope.$parent;
	$rootScope.$watch( 'current_company_changed', function( current_company_changed )
	{
		$scope.company = $rootScope.company;
		if( current_company_changed == $scope.current_node.id && parseInt( $rootScope.company.is_completed ) == 0 )
		{
			$scope.company.display_name = $scope.company.display_name ? $scope.company.display_name : $scope.company.name;
			/*if( $scope.company.subtitle || $scope.company.description )
			{
				$rootScope.parent_wizard.next( $scope.current_node.id );
			}*/
		}
	} )

	$scope.onBlurTitle = function( $event )
	{
		if( !$scope.company.permalink )
		{
			$scope.company.permalink = $filter( 'urlify' )( $scope.company.name );
		}
	}
	$scope.onBlurSlug = function( $event )
	{
		if( $scope.company.permalink )
		{
			$scope.company.permalink = $filter( 'urlify' )( $scope.company.permalink );
		}
	}

	$scope.save = function()
	{
		if( !$scope.company )
		{
			return;
		}

		var params = {
			'display_name': $scope.company.display_name,
			'subtitle': $scope.company.subtitle,
			'display_image': $scope.company.display_image,
			'bio': $scope.company.bio,
			'hide_revenue': $scope.company.hide_revenue,
			'hide_sites': $scope.company.hide_sites,
			'hide_members': $scope.company.hide_members,
			'hide_total_lessons': $scope.company.hide_total_lessons,
			'hide_total_downloads': $scope.company.hide_total_downloads,
			'permalink': $scope.company.permalink
		};

		Restangular.all( 'company' ).customPUT( params, $scope.company.id ).then( function( response )
		{
			toastr.success("Company settings were successfully saved");
			$scope.company = response;
			$rootScope.company = $scope.company;
			//$state.reload();
			$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
		} )
	}
} );

app.controller( 'inviteMembersWizardController', function( $scope, $state, $rootScope, $filter, $http, $localStorage, $modal, Restangular, toastr )
{
	$scope.team_members = {};
	$scope.current_node = $scope.$parent;
	$scope.save = function()
	{
		Restangular.one( "teamRole" ).customPOST( $scope.team_members, 'import' ).then( function( response )
		{
			toastr.success("Import was successful");
			$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
		} );
	}
	$scope.$watch( 'current_company_changed', function( current_company_changed )
	{
		if( current_company_changed == $scope.current_node.id && parseInt( $rootScope.company.is_completed ) == 0 )
		{
			
			/*Restangular.all( "teamRole" ).customGET( '' ).then( function( response )
			{
				if( response && response.items && response.items.length > 1 )
				{
					$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
				}
			} )*/
		}
	} )
	$scope.getRole = function( role, company_id )
	{
		for( var i = role.length - 1; i >= 0; i-- )
		{
			if( role[ i ].company_id == company_id )
			{
				return role[ i ].type[ 0 ].role_type;
			}
		}
		;
		return 3;
	}
	$scope.role = $scope.getRole( $rootScope.$user.role, $rootScope.company.id );

} );

app.controller( 'siteWizardController', function( $scope, $rootScope, $localStorage, $http, $modal, Restangular, toastr )
{
	$scope.site = {};
	$scope.clone_sites = [];
	$scope.current_node = $scope.$parent;

	$scope.init = function(id , node)
	{
		/*$scope.company = $rootScope.company;
		if(!node.is_completed)
		{
			Restangular.all( "site" ).getList( { user_id: $localStorage.user.id } ).then( function( response )
			{
				if( response && response.length )
				{
					$rootScope.site = response[ 0 ];
					//if( parseInt( $rootScope.company.is_completed ) == 0 )
					{
						//$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
						$rootScope.parent_wizard.next( id, $scope.$parent );
					}
				}
			} );
		}*/
		//remove the intelligence to check site.. making the wizard soly relies on the completed node now
	}
	Restangular.all( 'site' ).getList( { cloneable: 1 } ).then( function( response )
	{
		$scope.clone_sites = response;
		$scope.clone_sites.unshift( { id: 0, name: "Don't clone" } )
	} )

	$scope.save = function()
	{
		$scope.saving = true;
		Restangular.service( "site" ).post( $scope.site ).then( function( response )
		{
			toastr.success("Site Created!");
			$scope.saving = true;
			$rootScope.site = response;
			$rootScope.parent_wizard.next( 1, $scope.current_node, 'http://' + $scope.site.subdomain + '.smartmember.' + ($rootScope.app.rootDomain.indexOf('smartmember') != -1 ? 'com' : $rootScope.app.env) + '/admin/site/wizard/site_launch_wizard');
		}, function( response )
		{
			$scope.saving = false;

		} );
	}
	$scope.changeSite = function(id){
        $scope.current_clone_site = _.find($scope.clone_sites , {id : id});
    }

    $scope.cancel = function() {
        $rootScope.parent_wizard.cancel($scope.current_node);
    }
} );

app.controller( 'teamIconWizardController', function( $scope, $rootScope, $localStorage, $http, $modal, Restangular, toastr )
{
	$scope.current_node = $scope.$parent;
	$scope.$watch( 'current_company_changed', function( current_company_changed )
	{
		$scope.company = $rootScope.company;
		if( current_company_changed == $scope.current_node.id && parseInt( $rootScope.company.is_completed ) == 0 )
		{
			if( $scope.company.display_image )
			{
				$rootScope.parent_wizard.next( $scope.current_node.id );
			}
			else
			{
				$scope.$watch( 'company.display_image', function( display_image )
				{
					if( display_image )
					{
						Restangular.all( 'company' ).customPUT( { display_image: display_image }, $scope.company.id ).then( function( response )
						{
							toastr.success("Company icon successfully saved");
							$scope.company = response;
							$rootScope.company = $scope.company;
							$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
						} );
					}
				} )
			}
		}
	} )
} );
