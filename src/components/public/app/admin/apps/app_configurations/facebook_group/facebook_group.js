var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.apps.app_configurations.facebook_group", {
			url: "/facebook_group/:add_group?",
			templateUrl: "/templates/components/public/app/admin/apps/app_configurations/facebook_group/facebook_group.html",
			controller: "FacebookGroupController"
		} )
} );

app.controller( "FacebookGroupController", function( $scope, $rootScope, toastr, $localStorage, Restangular, $http, notify, Facebook, smEvent, $window )
{
	$scope.available_facebook_groups = [];
	$scope.facebook_groups = [];
	$scope.joined_facebook_groups = [];

    if( !$localStorage.user )
    {
        return;
    }

    angular.forEach( $scope.site.configured_app, function( value )
	{
        if( value.type == 'facebook_group' )
        {
            $scope.facebook_groups.push( value );
        }
    } );

    var src = '//connect.facebook.net/en_US/sdk.js',
		script = document.createElement( 'script' );
	script.id = 'facebook-jssdk';
	script.async = false;

	// Prefix protocol
	if( [ 'file', 'file:' ].indexOf( $window.location.protocol ) !== -1 )
	{
		src = 'https:' + src;
	}

	script.src = src;
	script.onload = function()
	{
		//flags.sdk = true; // Set sdk global flag
	};

	document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );

	$scope.access_levels_checked = [];

	$scope.group_id = {}
	$scope.group_id.selected = $scope.site.is_admin ? 0 : $scope.site.facebook_group_id;

	$scope.addFBGroup = function( access_level_id )
	{
		$scope.access_levels_checked.push( access_level_id );

		access_level = _.findWhere( $scope.access_levels, { id: parseInt( access_level_id ) } ) || _.findWhere( $scope.access_levels, { id: access_level_id + "" } );

		if( access_level )
		{
            if( access_level.facebook_group_id && $scope.available_facebook_groups.indexOf( access_level.facebook_group_id ) == -1 )
            {
                $scope.available_facebook_groups.push( access_level.facebook_group_id );
            }

            if( access_level.grants && access_level.grants.length > 0 )
			{
				angular.forEach( access_level.grants, function( value )
				{
                    if( value.grant_id && $scope.access_levels_checked.indexOf( value.grant_id ) == -1 )
                    {
                        $scope.addFBGroup( value.grant_id );
                    }
                } );
            }

            if( $scope.available_facebook_groups.length > 0 )
			{
				$scope.selected_group = $scope.available_facebook_groups[ 0 ];
				$rootScope.fb_groups_to_display = true;
				console.log( "Setting fb_groups_to_display true 1" );
			}
			else
			{
                if( !$scope.joined_facebook_groups )
                {
                    $rootScope.fb_groups_to_display = false;
	                console.log( "Setting fb_groups_to_display false 1" );
                }
            }


			Restangular.one( 'facebook' ).customGET( 'groups-joined', { user_id: $localStorage.user.id } ).then( function( response )
			{

				if( response.length > 0 )
				{
					angular.forEach( response, function( value, key )
					{
						$scope.joined_facebook_groups.push( value );
					} );
				}

				if( $scope.joined_facebook_groups.length == 0 )
				{
					$scope.joined_facebook_groups = false;

					if( $scope.available_facebook_groups.length == 0 )
					{
						$rootScope.fb_groups_to_display = false;
						console.log( "Setting fb_groups_to_display false 2" );
					}
				}
				else
				{
					$rootScope.fb_groups_to_display = true;
					console.log( "Setting fb_groups_to_display true 2" );
				}

				$scope.show_add_group = false;
			} );


        }
    }

    if( $scope.user && $scope.user.role && $rootScope.access_levels )
	{
		angular.forEach( $scope.user.role, function( value )
		{
			if( value.access_level_id && value.access_level_id != 0 && value.access_level_id != "" )
			{
                if( $scope.access_levels_checked.indexOf( value.access_level_id ) == -1 )
                {
                    $scope.addFBGroup( value.access_level_id );
                }
            }
        } );
    }

    //console.log('our real groups: ', $scope.available_facebook_groups );



	var user_options = {};
	$scope.joinGroup = function( group_id )
	{
		group = _.findWhere( $scope.site.configured_app, {
				type: 'facebook_group',
				remote_id: group_id
			} ) || _.findWhere( $scope.site.configured_app, { type: 'facebook_group', remote_id: group_id + '' } );

		FB.init( {
			appId: group.username,
			xfbml: true,
			version: 'v2.4'
		} );

		FB.login( function( response )
		{
			var user_id = response.authResponse.userID;

			$http.put( $scope.app.apiUrl + "/user/" + $localStorage.user.id, { facebook_user_id: user_id } ).then( function( response )
			{
				FB.ui( {
					method: 'game_group_join',
					id: group.remote_id
				}, function( response )
				{
					if( response.added == true )
					{
						swal( 'Congratulations, you have joined our Facebook Group!', 'You can access the group at any time by clicking the Facebook icon on the right side of the members area.' );
						user_options.fb_group_joined = group.remote_id;
						smEvent.Log( 'joined-fb-group', {
							'facebook-group-id': group_id
						} );
						Restangular.all( 'user' ).customPOST( {
							user_options: user_options,
							user_id: $localStorage.user.id
						}, "saveFacebookGroupOption" ).then( function( response )
						{
							$scope.joined_facebook_groups = response;
                            if( $scope.joined_facebook_groups )
                            {
                                $rootScope.fb_groups_to_display = true;
	                            console.log( "Setting fb_groups_to_display true 3" );
                            }
                        } );
                    }
                    else
                    {
                        if( response.error_code == 4001 )
						{
							user_options.fb_group_joined = group.remote_id;

							smEvent.Log( 'already-joined-fb-group', {
								'facebook-group-id': group_id
							} )

							Restangular.all( 'user' ).customPOST( {
								user_options: user_options,
								user_id: $localStorage.user.id
							}, "saveFacebookGroupOption" ).then( function( response )
							{
								swal( "You are already a member of this group" );
								$scope.joined_facebook_groups = response;
								if( $scope.joined_facebook_groups )
									$rootScope.fb_groups_to_display = true;
								console.log( "Setting fb_groups_to_display true 4" );
							} );
						}
					}
				} );
			} )
		}, { scope: '' } );

	}

	$scope.saveGroup = function( group_id )
	{
		$http.post( $scope.app.apiUrl + "/saveAlFb/" + group_id, { access_levels: $scope.site.fb_group_access_levels } ).then( function( response )
		{
			// notify({
			//         message:'Your group access levels have been saved',
			//         classes: 'alert-success',
			//         templateUrl : 'templates/modals/notifyTemplate.html'
			//     });
			toastr.success( 'Your group access levels have been saved', 'Toastr fun!' );

		} );
	}

	$scope.addGroup = function()
	{
		$scope.showDialog();
	}

	$scope.setAppId = function()
	{
		$http.put( $scope.app.apiUrl + "/site/" + $scope.site.id,
			{
				facebook_app_id: $scope.site.facebook_app_id,
				facebook_secret_key: $scope.site.facebook_secret_key
			} ).success( function()
		{
			$scope.show_add_group = true;
		} );
	}

	$scope.showDialog = function( app_id )
	{
		console.log( $scope.site.facebook_app_id )
		FB.init( {
			appId: $scope.site.facebook_app_id,
			xfbml: true,
			version: 'v2.4'
		} );

		FB.login( function()
		{
			FB.ui( {
					method: 'game_group_create',
					name: 'My Test Group',
					description: 'A description for the test group',
					privacy: 'CLOSED',
				},
				function( response )
				{


					if( response && response.id )
					{
						FB.api( '/' + response.id, function( group )
						{
							console.log( "Facebook", group );
							$http.post( $scope.app.apiUrl + '/facebook/setgroup', {
								"group_id": response.id.toString(),
								"username": group.name,
								"password": group.privacy,
							} ).success( function( res )
							{
								$scope.facebook_groups.push( res );
							} )
						} );

					}
					else
					{

					}
				}
			);
		}, { scope: '' } );
	}
} );