var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app", {
			templateUrl: 'templates/components/public/app/app.html',
			controller: "AppController",
			resolve: {
				$site: function( Restangular )
				{
					return Restangular.one( 'site', 'details' ).get();
				},

			}
		} )
} );

app.controller( "AppController", function( $scope, $site, $rootScope, $filter, $localStorage, $location, Restangular, toastr, $window, $timeout )
{
	$rootScope.site = $site;
	$rootScope.page_title = $site.name;
	//$rootScope.page_title = 'chanbged title';

	$rootScope.is_admin = false;
	$rootScope.site = $site;
	//$rootScope.site.wizard_step = 10;
	var options = {};
	$rootScope.options = {};

	$scope.is_member = $site.is_member;
	$scope.facebook_group = _.findWhere( $rootScope.site.configured_app, { type: 'facebook_group' } );
	$scope.facebook_access_group = $rootScope.site.fb_group_access_levels;

	$scope.bannerView = function( $id )
	{
		Restangular.one( 'trackViews', $id ).customPOST( {} );
	}

	$scope.resolve = function(){
		Restangular.all( 'accessLevel' ).getList( { site_id: $site.id } ).then(function(response){
			$rootScope.access_levels = response;
		})
	}


	$scope.ShouldSuiHandleEmbed = function( embed_code )
	{
		var url = $filter('extractsrc')(embed_code);

		//console.log( 'the url: ', url );

		var domain;
		//find & remove protocol (http, ftp, etc.) and get domain
		if( url.indexOf( "//" ) > -1 )
		{
			domain = url.split( '/' )[ 2 ];
		}
		else
		{
			domain = url.split( '/' )[ 0 ];
		}

		//find & remove port number
		domain = domain.split( ':' )[ 0 ];

		//console.log( "THE DOMAIN: ", domain, url );

		if( domain )
		{
			if( domain.indexOf('youtube.com') > -1 )
				return true;

			if( domain.indexOf('vimeo.com') > -1 )
				return true;
		}

		return false;
	};

	$scope.init = function()
	{
		var details = $site;
		if( details )
		{
			$.each( details.meta_data, function( key, data )
			{
				$rootScope.options[ data.key ] = data.value;
			} );
			if( details.menu_items )
			{
				$rootScope.options.menu_items = details.menu_items;
			}
			if( details.footer_menu_items )
			{
				$rootScope.options.footer_menu_items = details.footer_menu_items;
			}
			$rootScope.site = details;

            if( $rootScope.site.capabilities )
            {
                angular.forEach( $rootScope.site.capabilities, function(value){
                    if( value == 'view_restricted_content' )
                    {
                        $timeout(function(){
                            //$('.public .logged_in').attr('style', 'margin-top: 62px !important');
                        });
                    }
                })
            }
		}
		$scope.ads = details.ad;
		$scope.widgets = details.widgets;

		angular.forEach( $scope.widgets, function( value, key )
		{
			value.meta = {};

			angular.forEach( value.meta_data, function( value2, key2 )
			{
				value.meta[ value2.key ] = value2.value;
			} );

			if( value.type == 'banner' )
			{
				$scope.bannerView( value.banner.id );
			}
		} );
		$rootScope.site.configured_app = [];
		angular.forEach( details.app_configuration, function( value, key )
		{
			$rootScope.site.configured_app.push(value);
		} );

		$rootScope.options.theme_selection = false;
		$rootScope.options.themes = global_themes;
		$rootScope.options.theme_options = global_theme_options;

		$rootScope.loaded = true;
		$scope.loaded = true;
		$rootScope.options.original_theme = $rootScope.options.theme;

		if( $rootScope.options.original_theme == 'united' )
		{
			$scope.fix_menu_style = '.' + $rootScope.options.original_theme + ' .navbar-nav.main-menu a {color: #fff !important;text-decoration: none;}';
		}

		if( false && $localStorage.theme )
		{
			$rootScope.options.theme = $localStorage.theme;
			$rootScope.options.theme_selection = true;
		}
		$scope.options = $rootScope.options;
		//var $theme_url = '//my.' + ($rootScope.app.domain.indexOf('smartmember') < 0 ? 'smartmember.com' : $rootScope.app.domain)  + '/themes/' + $scope.options.theme + '/index.css';

		//if ($('link[href="' + $theme_url + '"]' ).length == 0)
		//{
		//$('head').append('<link rel="stylesheet" href="' + $theme_url + '"/>');
		//}
	};


	$scope.addMember = function()
	{
		Restangular.all( 'site/addMember' ).customPOST().then( function()
		{
			toastr.success( "You have become a member of this site" );
			$scope.is_member = true;
		} );
	}

	$scope.bannerClick = function( ads )
	{

		target = ads.open_in_new_tab ? '_blank' : '_self';
		Restangular.one( 'trackClicks', ads.id ).customPOST( {} ).then( function()
		{

		} );

	}

	$scope.isAdmin = function( role )
	{
		if( !role )
		{
			return false
		}
		for( var i = role.length - 1; i >= 0; i-- )
		{
			if( role[ i ].site_id == $site.id || role[ i ].site_id == $site.id + '' )
			{
				var admin = _.findWhere( role[ i ].type, { role_type: 4 } ) || _.findWhere( role[ i ].type, { role_type: "4" } );
				if( !admin )
				{
					admin = _.findWhere( role[ i ].type, { role_type: 3 } ) || _.findWhere( role[ i ].type, { role_type: "3" } );
				}
				if( !admin )
				{
					admin = _.findWhere( role[ i ].type, { role_type: 2 } ) || _.findWhere( role[ i ].type, { role_type: "2" } );
				}
				if( !admin )
				{
					admin = _.findWhere( role[ i ].type, { role_type: 1 } ) || _.findWhere( role[ i ].type, { role_type: "1" } );
				}
				if( admin )
				{
					return true;
				}
			}
		}
		return false;
	}

	$scope.hasAccess = function( role )
	{
		if( !role )
		{
			return false
		}

		for( var i = role.length - 1; i >= 0; i-- )
		{
			var Manager = _.findWhere( role[ i ].type, { role_type: 3 } );
			if( !Manager )
			{
				Manager = _.findWhere( role[ i ].type, { role_type: "3" } );
			}
			var Owner = _.findWhere( role[ i ].type, { role_type: 2 } );
			if( !Owner )
			{
				Owner = _.findWhere( role[ i ].type, { role_type: "2" } );
			}
			var PrimaryAdmin = _.findWhere( role[ i ].type, { role_type: 1 } );
			if( !PrimaryAdmin )
			{
				PrimaryAdmin = _.findWhere( role[ i ].type, { role_type: "1" } );
			}
			if( Manager || Owner || PrimaryAdmin )
			{
				return true;
			}
		}
		return false;
	}

	$scope.initPublicSite = function()
	{
		$scope.setMetaData();
		$scope.site = $rootScope.site;
	}

	$scope.setMetaData = function()
	{
		$rootScope.current_theme = 'default';

		if( $site && $site.meta_data )
		{
			$.each( $site.meta_data, function( key, data )
			{
				$rootScope.meta_data[ data.key ] = data.value;
				if( data.key == 'theme' )
				{
					$rootScope.current_theme = data.value;
				}
			} );
		}

		$scope.current_theme_options = [];

		angular.forEach( $rootScope.current_theme.theme_options, function( value )
		{
			var theme_option = false;
			if( typeof value == 'string' )
			{
				theme_option = _.findWhere( global_theme_options, { slug: value } );
				if( theme_option )
				{
					$scope.current_theme_options.push( theme_option );
				}
			}
			else if( typeof value == 'object' )
			{
				if( typeof value.slug != 'undefined' )
				{
					theme_option = _.findWhere( global_theme_options, { slug: value } );
				}

				theme_option = theme_option || {};

				angular.forEach( value, function( val, key )
				{
					theme_option[ key ] = val;
				} );

				if( theme_option )
				{
					$scope.current_theme_options.push( theme_option );
				}
			}
		} );
	}

	$rootScope.$watch( 'user', function( new_value, old_value ) {

		if( new_value && new_value.id )
		{
			$rootScope.is_site_admin = $scope.isAdmin( new_value.role );
			$rootScope.is_team_member = $scope.hasAccess( new_value.role );
		}

	},true );

	$scope.initPublicSite();
	$scope.resolve();

} );