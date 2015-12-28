app.controller( 'teamNameWizardController', function( $scope, $state, $rootScope, $filter, $http, $localStorage,  Restangular, toastr )
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

app.controller( 'teamBioWizardController', function( $scope, $state, $rootScope, $filter, $http, $localStorage,  Restangular, toastr )
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

app.controller( 'inviteTeamMembersWizardController', function( $scope, $state, $rootScope, $filter, $http, $localStorage,  Restangular, toastr )
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
	$scope.role = $scope.getRole( $rootScope.$user.role, $rootScope.site.company_id );

} );

app.controller( 'siteWizardController', function( $scope, $rootScope, $localStorage, $http,  Restangular, toastr )
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
			$rootScope.parent_wizard.next( 0, $scope.current_node );
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

app.controller( 'teamIconWizardController', function( $scope, $rootScope, $localStorage, $http,  Restangular, toastr )
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