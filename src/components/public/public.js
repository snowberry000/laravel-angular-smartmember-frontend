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
						/*
						 // ocLazyLoad
						 'pascalprecht.translate',       // Idle timer
						 'ngSanitize',                    // ngSanitize
						 'cfp.loadingBar',
						 'restangular',
						 'ipCookie',
						 'ngStorage',
						 'facebook',
						 'cgNotify',
						 'ngFileUpload',
						 'angular-spinkit',
						 'angularSpectrumColorpicker',
						 'oitozero.ngSweetAlert',
						 'froala',
						 'as.sortable',
						 'xeditable',
						 'ui.footable',
						 'ngAnimate',
						 'toastr',
						 'timer',
						 'ngBusy',
						 'angularModalService',
						 'ngDragDrop',
						 'angular-flot',
						 'infinite-scroll',
						 'ui.sortable',
						 'angularUtils.directives.dirPagination',
						 'ct.ui.router.extras',
						 '720kb.socialshare',
						 'ngUrlify'
						 
						 */
					] );
				}
			}
		} );

	paginationTemplateProvider.setPath( '/templates/core/html/pagination.html' );

} );

app.controller( 'PublicController', function( $scope, $q, $rootScope, smModal, User, smSidebar, $timeout, $localStorage, $location, Restangular, $stateParams, $state, $http, toastr, $window, Upload, smEvent )
{
	$rootScope.user_loading = false;
	$rootScope.user_loaded = false;
	$rootScope.user = null;


	$rootScope.sites_loading = false;
	$rootScope.sites_loaded = false;
	$rootScope.sites = {};

	$scope.launch_time_left = 1453795200000;

	$scope.current_hostname = location.hostname;

	$rootScope.access_level_types = [
		{ id: 4, name: 'Draft (admin-only)' },
		{ id: 3, name: 'Members' },
		{ id: 2, name: 'Locked' },
		{ id: 1, name: 'Visitors' },
	];

	$rootScope.last_base_state = {};
	$rootScope.last_site_state = {};

	$scope.current_site_domain = window.location.host;
	$rootScope.active_theme_option_section = 'layout';


	$rootScope.$on( "$stateChangeStart", function( evt, toState, toStateParams, fromState, fromStateParams )
	{
		//console.log( 'stateChangeStart', toState, fromState )

		if( !(fromState.name.indexOf( 'public.app.admin' ) > -1) && (toState.name.indexOf( 'public.app.admin' ) > -1) )
		{
			$rootScope.last_site_state = {
				state: fromState,
				params: fromStateParams
			};

			console.log( 'last_site_state', $rootScope.last_site_state )
			//$state.go( $scope.stateBehindModal.state, $scope.stateBehindModal.params );
		}

		if( !(fromState.name.indexOf( 'public.sign' ) > -1) && (toState.name.indexOf( 'public.sign' ) > -1) )
		{
			$rootScope.last_base_state = {
				state: fromState,
				params: fromStateParams
			};

			console.log( 'last_base_state', $rootScope.last_base_state )
			//$state.go( $scope.stateBehindModal.state, $scope.stateBehindModal.params );
		}

		$('.ui.popup').popup( 'hide all' );
	} );

	$rootScope.CloseAdminState = function()
	{
		var go_state = $rootScope.last_site_state.state || (!$scope.isSitelessPage() ? 'public.app.site.home' : '') ;// || 
		var params = $rootScope.last_site_state.params || null;
		var options = $rootScope.last_site_state.state ? null : { reload: true };
		 $rootScope.customSiteSet=true;

		console.log( 'closing the admin state', go_state, params, options );
		if(go_state)
			$state.go( go_state, params, options );
	};

	$rootScope.CloseExtraState = function()
	{
		var go_state = $rootScope.last_base_state.state ;
		var params = $rootScope.last_base_state.params || null;
		var options = $rootScope.last_base_state.state ? null : { reload: true };

		console.log( 'closing the extra state', go_state, params, options );

		if( go_state )
		{
			if( ( $location.path().indexOf('/sign/') > -1) && ( !go_state.name || go_state.name.indexOf('www') > -1 ) )
			{
				window.location.href = "http://" + $location.host();
			}
			else
				$state.go( go_state, params, options );
		}	
		else
		{
			window.location.href = "http://"+$location.host();
		}
			
	};

	$rootScope.CloseSignState = function()
	{
		window.location.href = "http://"+$location.host();	
	};

	$rootScope.SiteStateExists = function()
	{
		return true;
		return $rootScope.last_site_state.state;
	}

	$scope.LogOut = function()
	{
		User.signOut();
	}

	$scope.GetAdminBarInclude = function()
	{
		var state = $state.current.name.split( '.' );
		if( state.length >= 3 )
		{
			state = state[ 3 ];
		}

		if( $scope.isLoggedIn() && state != 'wallboard' && (true || $rootScope.app.subdomain != 'sm' || $rootScope.site.is_admin == true) )
		{
			return 'templates/components/public/admin-bar/admin-bar.html';
		}

		return;
	}

	$rootScope.$watch( 'user_loaded', function( new_value, old_value )
	{
		//console.log( 'user changed to ', new_value, ' from ', old_value );
		if( new_value && $rootScope.user && $rootScope.user.id )
		{
			$rootScope.sites_loading = true;

			if( $localStorage.open_sites_wizard_modal && $rootScope.site && $rootScope.site.is_admin )
			{
				$localStorage.open_sites_wizard_modal = null;
                location.href = $state.href('public.app.admin.wizard.list', {id: 'site_launch_wizard'});
			}
			else if( $localStorage.open_stripe_modal && $rootScope.site && $rootScope.site.is_admin )
			{
				$localStorage.open_stripe_modal = null;
				$state.go( 'public.app.admin.apps.app_configurations.list', { modal_options: { duration: 0 } } );
				// $timeout(function(){
				// 	smModal.Show( 'public.administrate.team.app_configurations.list' , { modal_options : {duration : 0 }});
				// 	$localStorage.open_stripe_modal = null;
				// } , 50)
			}
			else if( $localStorage.open_vimeo_modal && $rootScope.site && $rootScope.site.is_admin )
			{
				$localStorage.open_vimeo_modal = null;
				$state.go( 'public.app.admin.apps.app_configurations.list', { modal_options: { duration: 0 } } );
				// $timeout(function(){
				// 	smModal.Show( 'public.administrate.team.app_configurations.list' , { modal_options : {duration : 0 }} );
				// 	$localStorage.open_vimeo_modal = null;
				// } , 50)
			}

			Restangular.one( 'site/members' ).get().then( function( response )
			{
				$grouped_sites = response.items;
				$sites_copy = response.items;
				$sites = [];
				$sites_copy = _.groupBy( $sites_copy, function( item )
				{
					if( item )
					{
						switch( item.role )
						{
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
					}
				} );

				angular.forEach( $sites_copy, function( value, key )
				{
					for( var i = 0; i < value.length; i++ )
					{
						if( !value[ i ] || !value[ i ].subdomain )
						{
							continue;
						}

						if( value[ i ].subdomain == 'likastic' )
						{
							console.log( '' )
						}
						var exists = _.findWhere( $sites, { id: value[ i ].id } );
						if( !exists )
						{
							if( value[ i ].total_revenue )
							{
								value[ i ].total_revenue = parseInt( value[ i ].total_revenue );
							}
							if( value[ i ].total_lessons )
							{
								value[ i ].total_lessons = parseInt( value[ i ].total_lessons );
							}
							if( value[ i ].total_members )
							{
								value[ i ].total_members = parseInt( value[ i ].total_members );
							}

							$sites.push( value[ i ] );
						}
						else if( exists.subdomain == 'likastic' )
						{
							console.log( exists );
						}
					}
					;
				} );

				if( $localStorage.open_sites_wizard_modal && $rootScope.site && $rootScope.site.is_admin )
				{
					$localStorage.open_sites_wizard_modal = null;
					$state.go( 'public.app.admin.wizard.list', {
						id: 'site_launch_wizard',
						modal_options: { duration: 0 }
					} );
					// $timeout(function(){
					// 	smModal.Show( 'public.administrate.wizard', {id: 'site_launch_wizard' , modal_options : {duration : 0 }} );
					// } , 50)
				}

				angular.forEach( $sites, function( site, key )
				{
					if( !site )
					{
						return;
					}
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

				/*if( $localStorage.verification_hash )
				{
					Restangular.one( 'user/linkAccount' ).customPOST( { 'verification_hash': $localStorage.verification_hash } ).then( function( response )
					{
						if( response.status && response.status == 'OK' )
						{
							toastr.success( 'Accounts linked' );
						}
					} )

					$localStorage.verification_hash = undefined;
				}*/
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

		if( location.host.isCustomDomain() || domain != 'smartmember' || tld == 'io' )
		{
			return false;
		}

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

	//function only used for logged in -- determind home page url and redirect instead of default syllabus view
	$scope.determineHomeStateAndRedirect = function() {
		var homepage_url = null;

		if ($localStorage.homepage_url != undefined)
		{
			homepage_url = $localStorage.homepage_url;
		} else {
			if( !homepage_url || homepage_url == 'home' || homepage_url == '/' )
				homepage_url = 'lessons';
			angular.forEach( $rootScope.site.meta_data, function( value, key )
			{
				if( value.key == 'homepage_url' )
				{
					// alert(value.value);
					homepage_url = value.value;
				}
			} );
		}

		if( (window.location.pathname == '/' || window.location.pathname.indexOf('/sign/')>=0)&& $rootScope.subdomain != "my" || $rootScope.customSiteSet )
		{
			// alert("came in");
			$rootScope.customSiteSet=false;
			$homeState = 'public.app.site.lessons';

			if( homepage_url )
			{
				$states = $state.get();
				$intendedState = _.find( $states, function( $st )
				{
					$stArr = $st.name.split( '.' );
					$params = null;
					$uriParams = homepage_url.split( '?' );

					if( $st.url && ($uriParams.length == 1) )
					{
						$strURLs = $st.url.split( ":" );
						$homePageSplit = homepage_url.split( "/" );
						if( $strURLs.length > 1 )
						{
							$strURLs[ 0 ] = $strURLs[ 0 ].substring( 0, $strURLs[ 0 ].length - 1 );
						}
						$homePageSplit[ 0 ] = "/" + $homePageSplit[ 0 ];

						if( $stArr[ 0 ] == "public" && ($homePageSplit[ 0 ] == $strURLs[ 0 ]) && ($strURLs.length == $homePageSplit.length) )
						{
							$params = {};
							if( $homePageSplit.length > 1 )
							{
								$params[ $strURLs[ 1 ] ] = $homePageSplit[ 1 ];
							}
							else
							{
								$params = null;
							}
							return true;
						}
						else
						{
							return false;
						}
					}
					else if( $st.url )
					{
						if( $stArr[ 0 ] == "public" && ($st.url.split( '?' )[ 0 ]) == "/" + $uriParams[ 0 ] )
						{
							return true;
						}
						else
						{
							return false;
						}
					}
				} );
				if( $intendedState )
				{
					$homeState = $intendedState.name;
				}
				else
				{

					Restangular.one( 'permalink', homepage_url ).get().then( function( response )
							{
								switch( response.type )
								{
									case "lessons":
										//alert('else'+homepage_url);
										$timeout(function(){$state.go( 'public.app.site.lesson', { permalink: homepage_url }, { location: false } );},50);
										// $state.go( 'public.app.site.lesson', { permalink: homepage_url }, { location: false } );
										break;
									case "custom_pages":
										$timeout(function(){$state.go( 'public.app.site.page', { permalink: homepage_url }, { location: false } );},50);
										// $state.go( 'public.app.site.page', { permalink: homepage_url }, { location: false } );
										break;
									case "download_center":
										$timeout(function(){$state.go( 'public.app.site.download', { permalink: homepage_url }, { location: false } );},50);
										// $state.go( 'public.app.site.download', { permalink: homepage_url }, { location: false } );
										break;
									case "livecasts":
										$timeout(function(){$state.go( 'public.app.site.livecast', { permalink: homepage_url }, { location: false } );},50);
										// $state.go( 'public.app.site.livecast', { permalink: homepage_url }, { location: false } );
										break;
									case "posts":
										$timeout(function(){$state.go( 'public.app.site.post', { permalink: homepage_url }, { location: false } );},50);
										break;
									case "support_articles":
										$timeout(function(){$state.go( 'public.app.site.support-article', { permalink: homepage_url }, { location: false } );},50);
										break;
									case "bridge_bpages":
										$timeout(function(){$state.go( 'bridgepage', { permalink: homepage_url }, { location: false } );},50);
										break;
									case "forum_topics":
										$timeout(function(){$state.go("public.app.site.forum-topic",{permalink: homepage_url}, {location: false});},50);
										break;
									case "forum_categories":
										$timeout(function(){$state.go("public.app.site.forum-category",{permalink: homepage_url}, {location: false});},50);
										break;
									case 'affcontests':
										$timeout(function(){$state.go( 'public.app.site.affiliateContest', { permalink: homepage_url }, { location: false } );},50);
										break;
									case 'smart_links':
										location.href = response.redirect_url;
										break;
									case 'categories':
										$timeout(function(){$state.go( 'public.app.site.post-category', { permalink: homepage_url }, { location: false } );},50);
										break;
								}
								return;
							},
							function( response ) {
								$timeout(function(){$state.go( 'public.app.site.lessons', {}, { location: false } );},50);
							} );


				}
				return ;
			}

			if( $homeState == 'public.app.site.home2' )
				$homeState = 'public.app.site.lessons';

			if(  !$params )
			{
				$timeout(function(){$state.go( $homeState, {}, { location: false } );},50);
			}
			else
			{
				$timeout(function(){$state.go( $homeState, $params , { location: false } );},50);
				// $state.go( $homeState, $params, { location: false } );
			}
		}
		else
			$timeout(function(){
				$state.go( "public.app.site.lessons", {}, { location: false } );
			} , 5)
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
            $localStorage.transaction_params = $rootScope.$_GET;
            $localStorage.after_transaction_state = $state.current.name;
            $localStorage.after_transaction_params = $stateParams;
            $localStorage.after_transaction_params.permalink = location.href.substr( location.href.lastIndexOf('/') + 1, location.href.indexOf('?') - location.href.lastIndexOf('/') - 1 );

			location.href = $state.href( 'public.sign.transaction' );
		}
		else
		{
			$http.defaults.headers.common[ 'Authorization' ] = "Basic " + $localStorage.user.access_token;

            smEvent.Log( 'transaction-associated-for-logged-in-user', {
                'request-url': location.href
            } );

			Restangular.all( '' ).customGET( 'user/transactionAccess/' + $rootScope.$_GET[ 'cbreceipt' ] ).then( function( response )
			{
				if( location.host.isCustomDomain() || location.href.indexOf( 'sm.smartmember.' ) == -1 )
				{
					location.href = location.href.substr( 0, location.href.indexOf( '?' ) );
				}
				else
				{
					location.href = 'http://my.smartmember.' + $rootScope.app.env;
					smEvent.Log( 'landed-on-my-setup-site', {
					    'request-url': location.href
					} );
				}
			} );
		}
	}
	else if( $localStorage.open_signup_modal )
	{
        location.href = $state.href( 'public.sign.up' );
		// $timeout(function(){
		// 	smModal.Show( 'public.sign.up' ,{ modal_options : {duration : 0 }} );
		// } , 50)
		$localStorage.open_signup_modal = null;
	}
	else if( $localStorage.open_signin_modal )
	{
        location.href = $state.href( 'public.sign.in' );
		// $timeout(function(){
		// 	smModal.Show('public.sign.in' , { modal_options : {duration : 0 }});
		// } , 50)
		$localStorage.open_signin_modal = null;
	}
	else if( $localStorage.open_forgot_modal )
	{
        location.href = $state.href( 'public.sign.forgot' );
		// $timeout(function(){
		// 	smModal.Show('public.sign.forgot' , { modal_options : {duration : 0 }});
		// } , 50)
		$localStorage.open_forgot_modal = null;
	}
	else if( $localStorage.open_reset_modal )
	{
		var hash = $rootScope.$_GET['reset_hash'];
        location.href = $state.href( 'public.sign.reset',{hash: hash} );
		// if( !$localStorage.user ){
		// 	$timeout(function(){
		// 		smModal.Show('public.sign.reset' , { modal_options : {duration : 0 }});
		// 	} , 50)
		// }
		$localStorage.open_reset_modal = null;
	}
	else if( $localStorage.open_unsubscribe_modal )
	{
        $localStorage.unsubscribe_parameters = $rootScope.$_GET;
        location.href = $state.href( 'public.sign.unsubscribe' );
		$localStorage.open_unsubscribe_modal = null;
	}
	else if( $localStorage.open_speedblogging_modal )
	{
		smModal.Show( 'public.app.admin.speed-blogging' );

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
