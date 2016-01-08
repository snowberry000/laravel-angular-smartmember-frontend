var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate", {
			url: "/admin",
			templateUrl: "/templates/components/public/administrate/admin.html",
			controller: "AdminController",
			resolve: {
				$site: function( Restangular )
				{
					return Restangular.one( 'site', 'details' ).get();
				},
				$access_levels: function( Restangular, $site )
				{
					return Restangular.all( 'accessLevel' ).getList( { site_id: $site.id } );
				},
				$user: function( Restangular, $localStorage )
				{
					return Restangular.one( 'user', $localStorage.user.id ).get();
				},
				$support_tickets: function( Restangular )
				{
					//return Restangular.one('getUnreadSupportTickets').get();
					return [];
				},
				$companies: function( Restangular )
				{
					return Restangular.one( 'company/getUsersCompanies' ).get();
				},
				loadPlugin: function( $ocLazyLoad )
				{
					return $ocLazyLoad.load( [
						{
							files: [ 'bower/slimScroll/jquery.slimscroll.min.js' ]
						}
					] );
				}
			}
		} )
} );

app.controller( 'AdminController', function( $scope, Upload, $window, $sessionStorage, $localStorage, $rootScope, $state, $user, Restangular, notify, $site, $access_levels, $support_tickets, $companies, $location )
{
	var access = null;
	var new_company = null;
	$rootScope.site = $site;
	$rootScope.user = $user;
	//console.log( 'admin user:' );
	//console.log( $rootScope.user );

	$scope.resolveAdmin = function()
	{
		$rootScope.user = $user;

		if( $site && $site.meta_data )
		{
			angular.forEach( $site.meta_data, function( value, key )
				{
					if( value && value.key )
					{
						$site[ value.key ] = parseInt( value.value );
					}
				}
			);
		}
		if( typeof $site[ 'show_wizard' ] == 'undefined' )
		{
			$site[ 'show_wizard' ] = 1;
		}

		$scope.site = $site;
		//console.log( $scope.site )

		if( $user.id == $localStorage.user.id )
		{
			$rootScope.user.access_token = $localStorage.user.access_token;
		}

		$scope.access_levels = $access_levels;
		if( $scope.options )
		{
			$scope.options.theme = '';
		}
		$scope.support_ticket_count = $site.unread_support_ticket;
		$scope.companies = $companies.companies;
		$rootScope.companies = $scope.companies;
		$scope.current_company = _.find( $scope.companies, { selected: 1 } );
		$scope.sites = _.find( $companies.sites, function( k, s )
		{
			return parseInt( s ) == $scope.current_company.id;
		} )

		$rootScope.is_admin = $site.is_admin;
		$rootScope.adminLoggedIn = $site.is_admin;
		$rootScope.page_title = $site.name + " - " + "Admin";
		$rootScope.site = $scope.site;

		$scope.HideAdminMenu();

		$scope.isAgentOrGreater();

		$scope.getPrimaryAdminNotifications();
		//////////////

		$scope.agent_access = $scope.agent_access.concat( $scope.member_access );
		$scope.admin_access = []; //not used for now
		$scope.team_access = []; //not used for now

		$rootScope.is_agent = $scope.isAgent( $user.role );
		$rootScope.is_site_admin = $scope.isAdmin( $user.role );
		$rootScope.is_team_member = $scope.isTeamMember( $user.role );
		$rootScope.team_role_name = $scope.teamRoleName( $user.role );

		$scope.is_team_member = $rootScope.is_team_member;
		$scope.is_agent = $rootScope.is_agent;
		$scope.is_site_admin = $rootScope.is_site_admin;
		$scope.team_role_name = $rootScope.team_role_name;

		//if not logged in
		if( !$scope.$storage.user )
		{
			$state.go( 'public.app.login' );
		}

		new_company = _.find( $scope.companies, { id: $scope.site.company_id } );

		if( new_company && $scope.site.company_id && $scope.current_company && $scope.current_company.id && $scope.site.company_id != $scope.current_company.id )
		{
			$scope.current_company = new_company;
			Restangular.one( 'user/setCompany' ).customPOST( { 'current_company_id': $scope.current_company.id } ).then( function( response )
			{
				Restangular.one( 'user', $localStorage.user.id ).get().then( function( response )
				{
					$rootScope.user = response;
					$user = $rootScope.user;

					$rootScope.is_agent = $scope.isAgent( $user.role );
					$rootScope.is_site_admin = $scope.isAdmin( $user.role );
					$rootScope.is_team_member = $scope.isTeamMember( $user.role );
					$rootScope.team_role_name = $scope.teamRoleName( $user.role );
				} );
			} );
		}

	}


	$scope.HideAdminMenu = function()
	{

		$( "body" ).removeClass( "nav_open" );

	};


	$scope.showNotifications = function()
	{
		var modalInstance = $modal.open( {
			templateUrl: '/templates/modals/primaryAdminNotification.html',
			controller: "modalController",
			scope: $scope
		} );
		modalInstance.result.then( function()
		{
			Restangular.all( "siteNoticeSeen" ).post( { 'site_notice_id': $scope.notificationResponse.id } );
		} );
	}

	$scope.getPrimaryAdminNotifications = function()
	{
		$scope.notification = {};

		Restangular.all( '/siteNotice/getPrimaryAdminNotices' ).getList().then( function( response )
		{

			if( response.length < 1 )
			{
				return;
			}

			response = response[ 0 ];

			$scope.notificationResponse = response;

			$scope.notification.content = response.content;

			$scope.notification.title = response.title;

			$scope.showNotifications();
		} );
	}


	$scope.isAgentOrGreater = function()
	{
		if( typeof $scope.current_company == 'undefined' || typeof $scope.current_company.id == 'undefined' )
		{
			return;
		}

		$role = _.find( $user.role, function( r )
		{
			return r.company_id == $scope.current_company.id;
		} );

		if( typeof $role == 'undefined' )
		{
			$role = _.find( $user.role, function( r )
			{
				return r.site_id == $site.id;
			} );
		}

		if( typeof $role == 'undefined' )
		{
			return;
		}

		$role_type = Math.min.apply( Math, $role.type.map( function( t )
		{
			return t.role_type;
		} ) );

		if( $role_type <= 5 )
		{
			$rootScope.isAgentOrGreaterCheck = 'true';
		}
		else
		{
			$rootScope.isAgentOrGreaterCheck = 'false';
		}

		$scope.isAgentOrGreaterCheck = $rootScope.isAgentOrGreaterCheck;
	}


	$scope.isAgent = function( role )
	{
		if( typeof role == 'undefined' )
		{
			role = $user.role;
		}
		if( typeof role == 'undefined' )
		{
			return false;
		}
		for( var i = role.length - 1; i >= 0; i-- )
		{
			var agent = _.findWhere( role[ i ].type, { role_type: 5 } );
			if( !agent )
			{
				agent = _.findWhere( role[ i ].type, { role_type: "5" } );
			}
			if( agent )
			{
				return true;
			}
		}

		return false;
	}

	$scope.isAdmin = function( role )
	{
		if( typeof role == 'undefined' )
		{
			role = $user.role;
		}
		if( typeof role == 'undefined' )
		{
			return false;
		}
		for( var i = role.length - 1; i >= 0; i-- )
		{
			var admin = _.findWhere( role[ i ].type, { role_type: 4 } );
			if( !admin )
			{
				admin = _.findWhere( role[ i ].type, { role_type: "4" } );
			}
			if( admin )
			{
				return true;
			}
		}

		return false;
	}


	$scope.isTeamMember = function( role )
	{
		if( typeof role == 'undefined' )
		{
			role = $user.role;
		}
		if( typeof role == 'undefined' )
		{
			return false;
		}
		for( var i = role.length - 1; i >= 0; i-- )
		{
			var primaryAdmin = _.findWhere( role[ i ].type, { role_type: "1" } );
			if( !primaryAdmin )
			{
				primaryAdmin = _.findWhere( role[ i ].type, { role_type: 1 } );
			}
			var owner = _.findWhere( role[ i ].type, { role_type: "2" } );
			if( !owner )
			{
				owner = _.findWhere( role[ i ].type, { role_type: 2 } );
			}
			var manager = _.findWhere( role[ i ].type, { role_type: "3" } );
			if( !manager )
			{
				manager = _.findWhere( role[ i ].type, { role_type: 3 } );
			}
			if( primaryAdmin || owner || manager )
			{
				return true;
			}
		}
		return false;
	}


	$scope.teamRoleName = function( role )
	{
		for( var i = role.length - 1; i >= 0; i-- )
		{
			if( $scope.current_company && role[ i ].company_id == $scope.current_company.id )
			{
				var primaryOwner = _.findWhere( role[ i ].type, { role_type: 1 } ) || _.findWhere( role[ i ].type, { role_type: "1" } );
				var owner = _.findWhere( role[ i ].type, { role_type: 2 } ) || _.findWhere( role[ i ].type, { role_type: "2" } );
				var manager = _.findWhere( role[ i ].type, { role_type: 3 } ) || _.findWhere( role[ i ].type, { role_type: "3" } );
			}
		}

		if( primaryOwner )
		{
			return 'Primary Owner';
		}
		if( owner )
		{
			return 'Owner';
		}
		if( manager )
		{
			return 'Manager';
		}

		return '';
	}


	$scope.showComingSoon = function()
	{
		$name = 'This feature is coming soon';
		$scope.message = 'This feature will arrive shortly, so hold tight!';
		var modalInstance = $modal.open( {
			templateUrl: '/templates/modals/comingSoon.html',
			controller: "modalController",
			scope: $scope,
		} );
	}

	$scope.selectCompany = function( company )
	{
		if( typeof $scope.current_company != 'undefined' && typeof $scope.current_company.id != 'undefined' && company.id == $scope.current_company.id )
		{
			return;
		}
		Restangular.one( 'user/setCompany' ).customPOST( { 'current_company_id': company.id } ).then( function( response )
		{
			$window.location.href = '//my.' + $rootScope.app.rootDomain;
		} );
	}

	$scope.imageUpload = function( files )
	{

		for( var i = 0; i < files.length; i++ )
		{
			var file = files[ i ];
			Upload.upload( {
				url: $scope.app.apiUrl + '/utility/upload',
				file: file
			} )
				.success( function( data, status, headers, config )
				{
					//console.log( data.file_name );
					var editor = $.summernote.eventHandler.getModule();
					file_location = '/uploads/' + data.file_name;
					editor.insertImage( $scope.editable, data.file_name );
				} ).error( function( data, status, headers, config )
				{
					//console.log( 'error status: ' + status );
				} );
		}
	}
} );
