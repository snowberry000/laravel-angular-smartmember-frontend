var app = angular.module( "app" );

app.config( function( $stateProvider, paginationTemplateProvider )
{
	$stateProvider
		.state( "public", {
			templateUrl: "/templates/components/public/public.html",
			controller: "PublicController",
			resolve: {
				loadPlugin: function( $ocLazyLoad )
				{
					return $ocLazyLoad.load( [
						{
							files: [ 'bower/slimScroll/jquery.slimscroll.min.js' ]
						},
						{
							files: [ 'bower/semantic/dist/components/transition.min.css' ]
						}
					] );
				}
			}
		} );

	paginationTemplateProvider.setPath('/templates/core/html/pagination.html');

} );

app.controller( 'PublicController', function( $scope, $q, $rootScope, smModal, User, smSidebar, $timeout, $localStorage, $location, Restangular, $stateParams, $state, $http, toastr, $window, Upload )
{
	$rootScope.user_loading = false;
	$rootScope.user_loaded = false;
	$rootScope.user = null;

	$rootScope.sites_loading = false;
	$rootScope.sites_loaded = false;
	$rootScope.sites = {};

	$rootScope.access_level_types = [
		{ id: 4, name: 'Draft (admin-only)' },
		{ id: 3, name: 'Members' },
		{ id: 2, name: 'Locked' },
		{ id: 1, name: 'Visitors' },
	];

	$scope.current_site_domain = window.location.host;
	$rootScope.active_theme_option_section = 'layout';

	$scope.LogOut = function()
	{
		User.signOut();
	}

	$scope.GetAdminBarInclude = function()
	{	
		var state = $state.current.name.split('.');
		if(state.length >= 3){
			state = state[2];
		}

		if( $scope.isLoggedIn() && state != 'public,wallboard' && (true || $rootScope.app.subdomain != 'sm' || $rootScope.site.is_admin == true))
		{
			return 'templates/components/public/admin-bar/admin-bar.html';
		}

		return;
	}

	$rootScope.$watch( 'user_loaded', function( new_value, old_value )
	{
		console.log( 'user changed to ', new_value, ' from ', old_value );
		if( new_value && $rootScope.user && $rootScope.user.id )
		{
			$rootScope.sites_loading = true;

			if($localStorage.open_sites_wizard_modal && $rootScope.site && $rootScope.site.is_admin){
				$localStorage.open_sites_wizard_modal = null;
				smModal.Show( 'public.administrate.wizard', {id: 'site_launch_wizard' , modal_options : {duration : 0 }} );
				// $timeout(function(){
				// 	smModal.Show( 'public.administrate.wizard', {id: 'site_launch_wizard' , modal_options : {duration : 0 }} );
				// } , 50)
			}else if($localStorage.open_stripe_modal && $rootScope.site && $rootScope.site.is_admin){
				smModal.Show( 'public.administrate.team.app_configurations.list' , { modal_options : {duration : 0 }});
				// $timeout(function(){
				// 	smModal.Show( 'public.administrate.team.app_configurations.list' , { modal_options : {duration : 0 }});
				// 	$localStorage.open_stripe_modal = null;
				// } , 50)
			}else if($localStorage.open_vimeo_modal && $rootScope.site && $rootScope.site.is_admin){
				smModal.Show( 'public.administrate.team.app_configurations.list' , { modal_options : {duration : 0 }} );
				// $timeout(function(){
				// 	smModal.Show( 'public.administrate.team.app_configurations.list' , { modal_options : {duration : 0 }} );
				// 	$localStorage.open_vimeo_modal = null;
				// } , 50)
			}

			Restangular.one( 'site/members' ).get().then( function( response )
			{
				$grouped_sites = response;
				$sites_copy = response;
				$sites = [];
				$sites_copy = _.groupBy( $sites_copy, function(item){
					switch(item.role){
						case 'owner':
							return 0;
						case 'admin':
							return 1;
						case 'editor':
							return 2;
						case 'support':
							return 3;
						case 'member':
							return 4;
					}
				});
		
				angular.forEach($sites_copy , function(value , key){
					for (var i = 0; i < value.length ; i++) {
                        if( !value[i].subdomain )
                            continue;

						if(value[i].subdomain == 'likastic')
							console.log('')
						var exists = _.findWhere($sites , {id : value[i].id});
						if(!exists){
                            if( value[i].total_revenue )
                                value[i].total_revenue = parseInt( value[i].total_revenue );
                            if( value[i].total_lessons )
                                value[i].total_lessons = parseInt( value[i].total_lessons );
                            if( value[i].total_members )
                                value[i].total_members = parseInt( value[i].total_members );

							$sites.push(value[i]);
						}
						else if(exists.subdomain == 'likastic'){
							console.log(exists);
						}
					};
				});

				if($localStorage.open_sites_wizard_modal && $rootScope.site && $rootScope.site.is_admin){
					$localStorage.open_sites_wizard_modal = null;
					smModal.Show( 'public.administrate.wizard', {id: 'site_launch_wizard' , modal_options : {duration : 0 }} );
					// $timeout(function(){
					// 	smModal.Show( 'public.administrate.wizard', {id: 'site_launch_wizard' , modal_options : {duration : 0 }} );
					// } , 50)
				}

				angular.forEach( $sites, function( site, key )
				{
					if( !site )
						return;
					site.data = {};
					angular.forEach( site.meta_data, function( data, key )
					{
						site.data[ data.key ] = data.value;
					} );


					site.is_site_admin = $scope.isAdmin( $rootScope.user.role, site );
					site.is_team_member = $scope.isTeamMember( $rootScope.user.role, site );
					site.is_agent = $scope.isAgent( $rootScope.user.role, site );
					site.role_name = $scope.setRoleName( $rootScope.user.role, site );
				} );

				$rootScope.sites = $sites;
				$rootScope.sites_loading = false;
				$rootScope.sites_loaded = true;
			} );
		}
	} );

	$scope.Init = function()
	{
		$scope.StoreVerificationHash();

		if( $localStorage.user && $localStorage.user.id )
		{
			$rootScope.user_loading = true;

			$rootScope.user = Restangular.one( 'user', $localStorage.user.id ).get().then( function( response )
			{
				$rootScope.user = response;
				$rootScope.user_loading = false;
				$rootScope.user_loaded = true;

				if( $localStorage.verification_hash )
				{
					Restangular.one( 'user/linkAccount' ).customPOST( { 'verification_hash': $localStorage.verification_hash } ).then( function( response )
					{
						if( response.status && response.status == 'OK' )
						{
							toastr.success( 'Accounts linked' );
						}
					} )

					$localStorage.verification_hash = undefined;
				}
			} );
		}
		else
		{
			$rootScope.user_loaded = true;
		}
	}

	$scope.StoreVerificationHash = function()
	{
		if( $location.search().verification_hash )
		{
			$localStorage.verification_hash = $location.search().verification_hash;
		}
	}

	$rootScope.isSitelessPage = function( specific_site )
	{
		var parts = location.hostname.split( '.' );
		var subdomain = parts.shift();
		var domain = parts.shift();
		var tld = parts.shift();

		if( domain != 'smartmember' || tld == 'io' )
			return false;

		if( specific_site )
		{
			return (subdomain == specific_site);
		}
		else if( subdomain == 'my' || subdomain == 'www' )
		{
			return true;
		}

		return false;
	}

	$scope.isLoggedIn = function()
	{
		if( $localStorage.user && $localStorage.user.id )
		{
			return true;
		}
		return false;
	}

	if( location.href.indexOf( '?theme_options' ) > -1 )
	{
		$rootScope.app.show_engine = true;
	}

	$rootScope.meta_data = {};

	$rootScope.meta_data = {
		site_background_color: '#FFFFFF',
		navigation_background_color: '#FFFFFF',
		navigation_text_color: '#1b1c1d',
		section_background_color: '#FFFFFF',
		headline_text_color: '#1b1c1d',
		module_label_text_color: '#FFFFFF',
		module_label_background_color: '#2185d0',
		main_button_text_color: '#FFFFFF',
		main_button_background_color: '#2185d0',
		site_top_background_color: '',
		site_middle_background_color: '',
		site_bottom_background_color: '',
		footer_text_color: '#1b1c1d',
		logo_position: 'left',
		show_nav_icons: true,
		icon_position: 'top',
		navigation_style: '',
		navigation_location: '',
		logo_size: 'medium',
		logo_border: '',
		page_background_style: 'fluid',
		sidebar_position: 'right',
		module_label_style: 'ribbon',
		module_label_position: 'left',
		icon_size: 'fa-2x'
	};

	$scope.menuItemLabel = function()
	{
		$( '.ui-iconpicker' ).toggleClass( 'open' );
	}


	$scope.isAgent = function( member, site )
	{
		for( var i = 0; i < member.length; i++ )
		{
			var agent = _.findWhere( member[ i ].type, { role_type: 5 } );
			if( agent && site.id == member[ i ].site_id )
			{
				return true;
			}
		}
		return false;
	}

	$scope.isAdmin = function( member, site )
	{
		var role = _.findWhere( member, { site_id: site.id } );
		if( typeof role != 'undefined' )
		{
			var max_role = 9999;
			for( var i = 0; i < role.type.length; i++ )
			{
				if( role.type[ i ].role_type < max_role )
				{
					max_role = role.type[ i ].role_type;
				}
			}

			if( max_role < 5 )
			{
				return true;
			}
		}
		return false;

	}

	$scope.isTeamMember = function( member, site )
	{
		for( var i = 0; i < member.length; i++ )
		{
			var primary_owner = _.findWhere( member[ i ].type, { role_type: 1 } );
			var owner = _.findWhere( member[ i ].type, { role_type: 2 } );
			var manager = _.findWhere( member[ i ].type, { role_type: 3 } );

			if( (primary_owner || owner || manager) && (!site || site.id == member[ i ].site_id) )
			{
				return true;
			}
		}
		return false;
	}

	$scope.isTeamPrimaryOwner = function( member, site )
	{
		for( var i = 0; i < member.length; i++ )
		{
			var primary_owner = _.findWhere( member[ i ].type, { role_type: 1 } ) || _.findWhere( member[ i ].type, { role_type: "1" } );
			if( primary_owner && (!site || site.id == member[ i ].site_id) )
			{
				return true;
			}
		}

		return false;
	}


	$scope.setRoleName = function( member, site )
	{
		if( site.is_team_member )
		{
			for( var i = 0; i < member.length; i++ )
			{
				var primary_owner = _.findWhere( member[ i ].type, { role_type: 1 } );
				var owner = _.findWhere( member[ i ].type, { role_type: 2 } );
				var manager = _.findWhere( member[ i ].type, { role_type: 3 } );

				if( primary_owner && (!site || site.id == member[ i ].site_id) )
				{
					return "Primary Owner";
				}
				if( owner && (!site || site.id == member[ i ].site_id) )
				{
					return "Owner";
				}
				if( manager && (!site || site.id == member[ i ].site_id) )
				{
					return "Manager";
				}
			}
		}
		else if( site.is_site_admin )
		{
			return "Admin";
		}
	}

	var getUrlVars = function()
	{
		var vars = {};
		var parts = window.location.href.replace( /[?&]+([^=&]+)=([^&]*)/gi, function( m, key, value )
		{
			vars[ key ] = decodeURIComponent( value );
		} );
		return vars;
	}

	$rootScope.$_GET = getUrlVars();

	if( $rootScope.$_GET[ 'cbreceipt' ] )
	{
		if( !$localStorage.user )
		{
			smModal.Show( 'public.sign.transaction' );
            // $timeout( function(){
            //     smModal.Show( 'public.sign.transaction' );
            // }, 50);
		}
		else
		{
			$http.defaults.headers.common[ 'Authorization' ] = "Basic " + $localStorage.user.access_token;
			Restangular.all( '' ).customGET( 'user/transactionAccess/' + $rootScope.$_GET[ 'cbreceipt' ] ).then( function( response )
			{
                if( location.href.indexOf( 'sm.smartmember.' ) == -1 )
				    location.href = location.href.substr( 0, location.href.indexOf( '?' ) );
                else
                    location.href = 'http://my.smartmember.' + $rootScope.app.env;
			} );
		}
	}
	else if( $localStorage.open_signup_modal )
	{
		smModal.Show( 'public.sign.up' ,{ modal_options : {duration : 0 }} );
		// $timeout(function(){
		// 	smModal.Show( 'public.sign.up' ,{ modal_options : {duration : 0 }} );
		// } , 50)
		$localStorage.open_signup_modal = null;
	}
    else if ( $localStorage.open_signin_modal )
	{
		smModal.Show('public.sign.in' , { modal_options : {duration : 0 }});
		// $timeout(function(){
		// 	smModal.Show('public.sign.in' , { modal_options : {duration : 0 }});
		// } , 50)
		$localStorage.open_signin_modal = null;
	}
    else if ( $localStorage.open_forgot_modal )
    {
    	smModal.Show('public.sign.forgot' , { modal_options : {duration : 0 }});
    	// $timeout(function(){
    	// 	smModal.Show('public.sign.forgot' , { modal_options : {duration : 0 }});
    	// } , 50)
        $localStorage.open_forgot_modal = null;
    }
    else if ( $localStorage.open_reset_modal )
    {
    	smModal.Show('public.sign.reset' , { modal_options : {duration : 0 }});
        // if( !$localStorage.user ){
        // 	$timeout(function(){
        // 		smModal.Show('public.sign.reset' , { modal_options : {duration : 0 }});
        // 	} , 50)
        // }
        $localStorage.open_reset_modal = null;
    }
    else if ( $localStorage.open_unsubscribe_modal )
    {
    	smModal.Show('public.sign.unsubscribe');
        // $timeout(function(){
        //     smModal.Show('public.sign.unsubscribe');
        // }, 50);
        // $localStorage.open_unsubscribe_modal = null;
    }
    else if ( $localStorage.open_speedblogging_modal )
    {
    	smModal.Show('public.administrate.speed-blogging');
        // $timeout(function(){
        //     smModal.Show('public.administrate.speed-blogging');
        // }, 50);
        $localStorage.open_speedblogging_modal = null;
    }


	$scope.cancelThemeSelection = function()
	{
		var picker = $scope.options.theme;
		$scope.options.theme = $scope.options.original_theme;
		$scope.options.theme_changed = false;
		$scope.options.theme_selection = false;
		$localStorage.theme = undefined;
		if( $scope.options.theme != picker )
		{
			$scope.RefreshScreen();
		}
	}

	$scope.saveTheme = function()
	{
		var meta_data = { 'theme': $scope.options.theme };
		Restangular.all( 'siteMetaData' ).customPOST( meta_data, "save" ).then( function()
		{
			toastr.success( "Theme was set!" );
		} );
		$scope.options.theme_changed = false;
		$scope.options.original_theme = $scope.options.theme;
		$scope.options.theme_selection = false;
		$localStorage.theme = undefined;
	}

	$scope.RefreshScreen = function()
	{
		$state.go( $state.current, $stateParams, { reload: 'public.app' } );
	}

	$scope.upload = function( files )
	{
		if( files )
		{
			$scope.loading = true;

			var file = files;

			Upload.upload( {
					url: $scope.app.apiUrl + '/utility/upload' + ( $scope.privacy ? '?private=' + $scope.privacy : '' ),
					file: file
				} )
				.success( function( data, status, headers, config )
				{
					var returnObject = {};

					returnObject.file = data.file_name;

					if( data.aws_key !== undefined )
					{
						returnObject.aws_key = data.aws_key;
					}

					$modalInstance.close( returnObject );
				} ).error( function( data, status, headers, config )
			{
				console.log( 'error status: ' + data );
			} );
		}
	};

	$scope.$watch( 'files', function()
	{
		$scope.upload( $scope.files );
	} );

	$scope.Init();


} );
