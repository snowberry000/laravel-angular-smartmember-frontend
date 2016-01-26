var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.members.list", {
			url: "/list",
			templateUrl: "/templates/components/public/app/admin/members/list/list.html",
			controller: "MembersController"
		} )
} );

app.controller( 'MembersController', function( $scope, $localStorage, $rootScope, $location, $stateParams, Restangular, toastr, $state )
{
	$scope.site = $site = $rootScope.site;
	$scope.user = $user = $rootScope.user;

	$scope.template_data = {
		title: 'MEMBERS',
		description: 'Members are users who have registered on your site, purchased a product, or been imported.',
		singular: 'member',
		edit_route: '',
		api_object: 'siteRole'
	}

	$scope.data = [];
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );

	$scope.resolve = function(){
		Restangular.all('accessLevel').getList({site_id : $scope.site.id}).then(function(response){
			$scope.access_levels = response;
		})

		Restangular.all('importJob/active').customGET().then(function(response) {
			$scope.active_count = response;
		})
	}

	$scope.paginate = function(search)
	{
		var $params = { p: $scope.pagination.current_page, site_id: $site.id };

		if (search)
		{
			$scope.pagination.current_page = 1;
		}

		if( true )
		{

			$scope.loading = true;



			if( $scope.query )
			{
				$params.q = encodeURIComponent( $scope.query );
			}

			if( $scope.access_level )
			{
				$params.access_level = $scope.access_level;

				if( $scope.access_level_status )
				{
					$params.access_level_status = $scope.access_level_status;
				}
			}

			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.access_level_query ? '&access_level_id=' +  $scope.access_level_query : '' ) +  ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
			{
				$scope.loading = false;
				$scope.pagination.total_count = data.total_count;
				$scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );//data.items;
				$scope.data = $scope.filterDuplicate($scope.data);
			} );
		}
	}

	$scope.paginate();
	$scope.resolve();

	$scope.clearFilter = function()
	{
		$scope.access_level_query = '';
		$scope.paginate(true);
		$('.access_level_dropdown .text').empty();
	}

	$scope.filterDuplicate = function(data){
		var new_data = [];
		for (var i = data.length - 1; i >= 0; i--) {
			if(!data[i].user_id)
				continue;
			var index = _.findWhere(new_data , {user_id : data[i].user_id});

			if(index){
				if(index.type && index.type.split(',').indexOf(data[i].type) < 0)
					index.type = index.type + ',' + data[i].type;
				if(data[i].access_level){
					index.access_level = index.access_level ? index.access_level + ',' + data[i].access_level.name : data[i].access_level.name;
				}
			}else{
				data[i].access_level = data[i].access_level ? data[i].access_level.name : '';
				new_data.push(data[i]);
			}
		};
		return new_data;
	}

	$scope.search = function()
	{
		$scope.loading = true;
		$scope.data = [];
		$scope.pagination = {
			current_page: 1,
			per_page: 25,
			total_count: 0
		};
		var $params = { site_id: $site.id, p: $scope.pagination.current_page };

		if( $scope.query )
		{
			$params.q = encodeURIComponent( $scope.query );
		}

		if( $scope.access_level )
		{
			$params.access_level = $scope.access_level;

			if( $scope.access_level_status )
			{
				$params.access_level_status = $scope.access_level_status;
			}
		}

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
		{
			$scope.pagination.total_count = data.total_count;

			$scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

			$scope.loading = false;
		}, function( error )
		{
			$scope.data = [];
		} )
	}


	$scope.accessLevelList = function( next_item )
	{
		var access_level_list = [];
		if( typeof next_item.access_level != 'undefined' )
		{
			angular.forEach( next_item.access_level, function( value2, key2 )
			{
				if( typeof value2.name != 'undefined' && value2.name != '' )
				{
					access_level_list.push( value2.name );
				}
			} );
		}

		return access_level_list.join( ', ' );
	}

	$scope.getCSV = function()
	{
		Restangular.all( '' ).customGET( 'siteRole/getCSV', { site_id: $site.id } ).then();
	}

	$scope.toggleAccess = function( member )
	{
		if(member.type.indexOf('owner') >= 0)
			return;
		var new_role = member.type;

		if(member.type.indexOf('admin') < 0)
			new_role = 'admin';
		else
			new_role = 'member';
		Restangular.all('siteRole').customPUT({type : new_role} , member.id).then(function(response){
			//member = response;
			for( var i = 0; i < $scope.data.length; i++ )
			{
				if( $scope.data[ i ].id == response.id )
				{
					$scope.data[ i ].type = response.type;
				}
			}
		})

		/*if( typeof member.type != 'undefined' )
		{
			var p_owner = _.findWhere( member.type, { role_type: 1 } );
			var owner = _.findWhere( member.type, { role_type: 2 } );
			var manager = _.findWhere( member.type, { role_type: 3 } );

			if( p_owner || owner || manager )
			{
				return;
			}

			var role = _.filter( member.type, function( type )
			{
				return type.role_type == 2 || type.role_type == 3 || type.role_type == 4 || type.role_type == 6;
			} )

			if( role[ 0 ].role_type == 4 )
			{
				role[ 0 ].role_type = 6;
			}
			else if( role[ 0 ].role_type == 6 )
			{
				role[ 0 ].role_type = 4;
			}

			if( role[ 0 ].role_type < 6 )
			{
				if( !member.isTeamMember )
				{
					$scope.addToTeam( member );
				}
			}

			Restangular.all( 'userRole' ).customPUT( { role_type: role[ 0 ].role_type }, role[ 0 ].id ).then( function( response )
			{
				members.getList( { id: member.id } ).then( function( response )
				{
					if( response.length < 1 )
					{
						return;
					}

					for( var i = 0; i < $scope.members.length; i++ )
					{
						if( $scope.data[ $scope.pagination.current_page ][ i ].id == response[ 0 ].id )
						{
							$scope.data[ $scope.pagination.current_page ][ i ] = response[ 0 ];
						}
					}
					;
				} );
			} );
		}*/
	}

	$scope.addToTeam = function( member )
	{
		Restangular.all( 'teamRole/addToTeam' ).post( { user_id: member.user.id } ).then( function( response )
		{
			member.isTeamMember = true;
		} );
	}

	$scope.toggleAgent = function( member )
	{
		/*var agent = _.findWhere( member.type, { role_type: 5 } );
		if( agent )
		{
			Restangular.one( 'userRole', agent.id ).remove().then( function( response )
			{
				member.type = _.without( member.type, agent );
			} )
		}
		else
		{
			Restangular.all( 'userRole' ).post( { role_type: 5, role_id: member.id } ).then( function( response )
			{
				member.type.push( response );
				if( !member.isTeamMember )
				{
					$scope.addToTeam( member );
				}
			} )
		}*/
		var new_role = member.type;
		if(member.type.indexOf('member') >= 0)
		{
			new_role = 'support';
		}
		else if(member.type.indexOf('support') >= 0){
			new_role = 'member'
		}
		Restangular.all( 'siteRole' ).customPUT( { type: new_role}, member.id ).then(function(response){
			for( var i = 0; i < $scope.data.length; i++ )
			{
				if( $scope.data[ i ].id == response.id )
				{
					$scope.data[ i ].type = response.type;
				}
			}
		})

	}

	$scope.stopPropagation = function( $event )
	{
		$event.stopPropagation();
	}

	$scope.addAccessPass = function( member )
	{
		if( typeof member.new_access_level != 'undefined' && member.new_access_level != '' && member.new_access_level != 0 )
		{
			member.new_access_pass_saving = true;
			member.new_access_pass = {
				access_level_id: member.new_access_level,
				user_id: member.user_id,
				site_id: $site.id,
				type : 'member'
			}
			Restangular.service( "siteRole" ).post( member.new_access_pass ).then( function( response )
			{
				toastr.success( "Access pass created!" );
				member.new_access_pass_saving = false;
				member.new_access_level = 0;
				if( !member.access_level )
				{
					member.access_level = [];
				}
				member.access_level.push( member.new_access_pass );
				member.access_level_selection = false;
			} );
		}
	}

	$scope.isOwner = function( member )
	{
		return member.type.indexOf('owner') >= 0;
		/*var p_owner = _.findWhere( member.type, { role_type: 1 } ) || _.findWhere( member.type, { role_type: "1" } );
		var owner = _.findWhere( member.type, { role_type: 2 } ) || _.findWhere( member.type, { role_type: "2" } );
		var manager = _.findWhere( member.type, { role_type: 3 } ) || _.findWhere( member.type, { role_type: "3" } );
		if( p_owner || owner || manager )
		{
			return true;
		}
		return false;*/
	}

	$scope.isAgent = function( member )
	{
		return member.type.indexOf('support') >= 0 || member.type.indexOf('admin') >= 0 || member.type.indexOf('owner') >= 0;
		/*var agent = _.findWhere( member.type, { role_type: 5 } ) || _.findWhere( member.type, { role_type: "5" } );
		if( agent )
		{
			return true;
		}
		return false;*/
	}

	$scope.isAdmin = function( member )
	{
		return member.type.indexOf('admin') >= 0 || member.type.indexOf('owner') >= 0;
		/*var admin = _.findWhere( member.type, { role_type: 4 } ) || _.findWhere( member.type, { role_type: "4" } );
		if( admin )
		{
			return true;
		}
		return false;*/
	}

	$scope.deleteResource = function( id )
	{
        console.log('here is the id: ', id );
        var itemWithId = _.findWhere( $scope.data, {id: parseInt( id ) } ) || _.findWhere( $scope.data, {id: id + '' } );
        console.log( 'here is the item: ', itemWithId );

		Restangular.all('siteRole/removeUserFromCurrentSite').post({user_id: itemWithId.user_id}).then( function()
		{
			$scope.data = _.without( $scope.data, itemWithId );
			var this_site = _.findWhere($rootScope.sites , {id : itemWithId.site_id});

			if(this_site){
				this_site.total_members--;
			}
		} );

	};
} );