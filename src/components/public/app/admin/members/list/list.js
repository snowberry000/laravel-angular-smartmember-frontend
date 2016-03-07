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

	$exportQuery = $scope.access_level_query ? '&access_level_id=' +  $scope.access_level_query : '' ;

	$scope.exportLink = $rootScope.apiURL+"/siteRole/getCSV?access_token="+$scope.$storage.user.access_token;

	$scope.template_data = {
		title: 'MEMBERS',
		description: 'Members are users who have registered on your site, purchased a product, or been imported.',
		singular: 'member',
		edit_route: '',
		api_object: 'user'
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

		if(search && ($scope.query.length < 3 && $scope.query.length != 0)) {
			return;
		}
		else if($scope.query && $scope.query.length < 3 && $scope.query.length != 0){
			$scope.query='';
		}
		$exportQuery = $scope.access_level_query ? '&access_level_id=' +  $scope.access_level_query : '' ;
		if($scope.query)
			$exportQuery += '&q=' +  $scope.query ;
		$scope.exportLink = $rootScope.apiURL+"/siteRole/getCSV?access_token="+$scope.$storage.user.access_token+$exportQuery;

		
		if( search )
		{
			$scope.pagination.current_page = 1;
		}

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

        Restangular.all( '' ).customGET( $scope.template_data.api_object + '?p=' + $params.p + ( $scope.access_level_query ? '&access_level_id=' +  $scope.access_level_query : '' ) +  ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
        {
            $scope.loading = false;
            $scope.pagination.total_count = data.total_count;
            $scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
        } );
	}

	$scope.paginate();
	$scope.resolve();

	$scope.clearFilter = function()
	{
		$scope.access_level_query = '';
		$scope.paginate();
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
		if( typeof next_item.role != 'undefined' )
		{
			if($scope.access_level_query)
			{
				console.log('$scope.access_level_query');
				console.log($scope.access_level_query);
				$role =  _.find(next_item.role , function(r){ return r.access_level_id == $scope.access_level_query; });
				return $role.access_level.name;
			}
			angular.forEach( next_item.role, function( value2, key2 )
			{
				if( value2.access_level && typeof value2.access_level.name != 'undefined' && value2.access_level.name != '' )
				{
					if(access_level_list.indexOf(value2.access_level.name) < 0)
						access_level_list.push( value2.access_level.name );
				}
			} );
		}

		return access_level_list.join( ', ' );
	}

	$scope.getaccessLevelList = function( next_item )
	{
		var access_level_list = [];
		if( typeof next_item.role != 'undefined' )
		{
			angular.forEach( next_item.role, function( value2, key2 )
			{
				if( value2.access_level && typeof value2.access_level.name != 'undefined' && value2.access_level.name != '' )
				{
					access_level_list.push( value2.access_level.name );
				}
			} );
		}
		return access_level_list;
	}

	$scope.getCSV = function()
	{
		Restangular.all( '' ).customGET( 'siteRole/getCSV', { site_id: $site.id } ).then();
	}

	$scope.toggleAccess = function( member )
	{
		if( $scope.isOwner( member) )
			return;

        var role;
		if( $scope.isAdmin( member ) ) {
            role = _.findWhere( member.role, {type: 'admin' } );
            new_role = 'member';
        }
		else {
            role = _.findWhere( member.role, {type: 'member' } );
            new_role = 'admin';
        }

		Restangular.all('siteRole').customPUT( {type : new_role} , role.id).then(function(response){
            role.type = response.type;
		})
	}

	$scope.addToTeam = function( member )
	{
		Restangular.all( 'teamRole/addToTeam' ).post( { user_id: member.id } ).then( function( response )
		{
			member.isTeamMember = true;
		} );
	}

	$scope.toggleAgent = function( member )
	{
        if( $scope.isOwner( member) )
            return;

        var role;
        if( $scope.is_role( member, 'support' ) ) {
            role = _.findWhere( member.role, {type: 'support' } );
            new_role = 'member';
        }
        else {
            role = _.findWhere( member.role, {type: 'member' } );
            new_role = 'support';
        }

        Restangular.all('siteRole').customPUT( {type : new_role} , role.id).then(function(response){
            role.type = response.type;
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
				user_id: member.id,
				site_id: $site.id,
				type : 'member'
			}

			var temp = _.findWhere($scope.access_levels , {id : parseInt(member.new_access_level)});
			//console.log($scope.access_levels);
			
			if(temp)
			{

				$accesses= $scope.getaccessLevelList(member);
				$val =_.findWhere($accesses , temp.name);
				if($val)
				{
					member.new_access_pass_saving = false
					toastr.error("access level already exist");
					return;
				}
					
			}

			

			Restangular.service( "siteRole" ).post( member.new_access_pass ).then( function( response )
			{
				toastr.success( "Access pass created!" );
				member.new_access_pass_saving = false;
				var access_pass = _.findWhere($scope.access_levels , {id : parseInt(member.new_access_level)});
				member.new_access_level = 0;
				
				if( access_pass ){
                    member.new_access_pass.access_level = access_pass;
					member.role.push(member.new_access_pass);
				}
				member.access_level_selection = false;
			} );
		}
	}

	$scope.isOwner = function( member )
	{
		return $scope.is_role( member, 'owner' );
	}

	$scope.isAgent = function( member )
	{
        return $scope.is_role( member, 'support' ) || $scope.is_role( member, 'admin' ) || $scope.is_role( member, 'owner' );
	}

	$scope.isAdmin = function( member )
	{
        return $scope.is_role( member, 'admin' ) || $scope.is_role( member, 'owner' );
	}

    $scope.highestRole = function( member )
    {
    	if($scope.access_level_query)
    	{
    		$role =  _.find(member.role , function(r){ return r.access_level_id == $scope.access_level_query; });
    		return $role.type;
    	}

        if( $scope.is_role( member, 'owner' ) )
            return 'owner';
        else if( $scope.is_role( member, 'admin' ) )
            return 'admin';
        else if( $scope.is_role( member, 'support' ) )
            return 'support';

        return 'member';
    }

    $scope.is_role = function( member, role ) {
        var is_role = false;

        if( member.role != undefined && member.role.length > 0 )
        {
            angular.forEach( member.role, function(value) {
                if( value.type == role )
                    is_role = true;
            } );
        }

        return is_role;
    }

	$scope.deleteResource = function( id )
	{
        var itemWithId = _.findWhere( $scope.data, {id: parseInt( id ) } ) || _.findWhere( $scope.data, {id: id + '' } );

		Restangular.all('siteRole/removeUserFromCurrentSite').post({user_id: itemWithId.id}).then( function()
		{
			$scope.data = _.without( $scope.data, itemWithId );
			var this_site = _.findWhere($rootScope.sites , {id : itemWithId.site_id});

			if(this_site){
				this_site.total_members--;
			}
		} );

	};
} );