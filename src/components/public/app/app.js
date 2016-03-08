var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app", {
			sticky: true,
			abstract: true,
			views: {
				'base': {
					templateUrl: '/templates/components/public/app/app.html',
					controller: "AppController"
				},
				'extra': {
					template: ""
				}
			},
			resolve: {
				$site: function( Restangular )
				{
					return Restangular.one( 'site', 'details' ).get();
				},
			}
		} )
} );

app.controller( "AppController", function( $scope, $state, $site, $rootScope, $filter, $localStorage, $location, Restangular, toastr, $window, $timeout )
{
	$rootScope.site = $site;

	console.log($site);

    var intercom;



    if( location.href.indexOf( '://my.smartmember.') == -1 ) {
        intercom = _.findWhere($scope.site.app_configuration, {type: 'intercom'});

        if( intercom ) {
            intercom.meta = {};

            if (intercom.meta_data) {
                angular.forEach(intercom.meta_data, function (value) {
                    intercom.meta[value.key] = value.value;
                });
            }
        }

    } else {
        intercom = {type: 'intercom', username: 'd0qzbbdk', meta: { enable_support: 1 } };
    }


    //If User is SM Customer and doesn't have Intercom configuration, then brute force these settings:
    if ($site.is_customer && !_.findWhere($scope.site.app_configuration, {type: 'intercom'}) && $localStorage.user && $localStorage.user.id) {
    	var intercomData = {
		    app_id: "d0qzbbdk",
		    name: $localStorage.user.first_name + " " + $localStorage.user.last_name,
			email: $localStorage.user.email,
			created_at: moment( $localStorage.user.created_at ).unix()
		};
    	window.intercomSettings = intercomData;
		window.Intercom( 'boot', intercomData);
		intercom = false;
    }



	if( intercom )
	{
		if( $localStorage.user && $localStorage.user.id && intercom.meta && intercom.meta.enable_support && intercom.meta.enable_support != '0' )
		{
			var intercomData = {
				app_id: intercom.username,
				name: $localStorage.user.first_name + " " + $localStorage.user.last_name,
				email: $localStorage.user.email,
				created_at: moment( $localStorage.user.created_at ).unix()
			};

			window.Intercom( 'boot', intercomData );
		}
		else
		{
			window.Intercom( 'boot', { app_id: intercom.username } );
		}

	}

	//console.log( intercom );

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

	$scope.resolve = function()
	{
		Restangular.all( 'accessLevel' ).getList( { site_id: $site.id } ).then( function( response )
		{
			$rootScope.access_levels = response;
			
		} )
	}

	$scope.ShouldSuiHandleEmbed = function( embed_code )
	{
		var url = $filter( 'extractsrc' )( embed_code );

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
			if( domain.indexOf( 'youtube.com' ) > -1 )
			{
				return true;
			}

			if( domain.indexOf( 'vimeo.com' ) > -1 )
			{
				return true;
			}
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
				//alert('asd');
				$rootScope.options.menu_items =  $filter('orderBy')(details.menu_items, 'sort_order');
				console.log($rootScope.options.menu_items );
				setTimeout(function() {
					$rootScope.limitElements = $rootScope.options.nav_items_dropdown == '1' ? parseInt($('div[ng-include*=top-nav]').width() / 96)-1 : $rootScope.options.menu_items.length;
					console.log('loaded' + $rootScope.limitElements);
					$scope.$apply();
					$rootScope.$apply();

				}, 2000);
			}
			if( details.footer_menu_items )
			{
				$rootScope.options.footer_menu_items = details.footer_menu_items;
			}
			$rootScope.site = details;

			if( $rootScope.site.capabilities )
			{
				angular.forEach( $rootScope.site.capabilities, function( value )
				{
					if( value == 'view_restricted_content' )
					{
						$timeout( function()
						{
							//$('.public .logged_in').attr('style', 'margin-top: 62px !important');
						} );
					}
				} )
			}
		}
		$scope.ads = details.ad;
		$scope.widgets = details.widgets;

		angular.forEach( $scope.widgets, function( value, key )
		{
			value.meta = {};
			value.location_data = {};

			angular.forEach( value.meta_data, function( value2, key2 )
			{
				value.meta[ value2.key ] = value2.value;
			} );

            angular.forEach( value.locations, function(value2, key2 ) {
                value.location_data[ value2.type + ( value2.target ? '_' + value2.target : '' ) ] = true;
            });

			if( value.type == 'banner' )
			{
				if( value.banner != undefined )
				{
					$scope.bannerView( value.banner.id );
				}
			}
		} );

        if( !$rootScope.widget_target_type )
            $rootScope.widget_target_type = 'page';
        if( !$rootScope.widget_target )
            $rootScope.widget_target = 'syllabus';

        $rootScope.showWidget = function( widget ) {
            var location_type = $rootScope.widget_target_type;
            var target = $rootScope.widget_target;

            if( widget.location_data.everywhere )
                return true;

            if( widget.location_data[ location_type + '_all' ] )
                return true;

            if( widget.location_data[ location_type + '_' + target ] )
                return true;

            return false;
        }

        $rootScope.social_share = {
            text: details.name,
            media: $rootScope.options.logo,
            description: ''
        }

        $rootScope.strip_tags = function(input, allowed) {
            allowed = (((allowed || '') + '')
                .toLowerCase()
                .match(/<[a-z][a-z0-9]*>/g) || [])
                .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
            var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
            return input.replace(commentsAndPhpTags, '')
                .replace(tags, function($0, $1) {
                    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                });
        }

        $rootScope.setSocialShare = function( text, description, media ) {
            if( text )
                $rootScope.social_share.text = $rootScope.strip_tags( text );

            if( description )
                $rootScope.social_share.description = $rootScope.strip_tags( description );

            if( media )
                $rootScope.social_share.media = media;
        }

        $rootScope.setSocialShareForContent = function( next_item ) {

            var text = null;
            var description = null;
            var media = null;

            if( next_item.seo_settings )
            {
                angular.forEach( next_item.seo_settings, function( value ) {
                    switch( value.meta_key )
                    {
                        case 'fb_share_title':
                            text = value.meta_value;
                            break;
                        case 'fb_share_description':
                            description = value.meta_value;
                            break;
                    }
                } )
            }

            if( !text && next_item.title )
                text = next_item.title;

            if( !description && next_item.content )
                description = $filter( 'cut' )( next_item.content );

            if( !media && next_item.featured_image )
                media = next_item.featured_image;

            $rootScope.setSocialShare( text, description, media );
        }

        $rootScope.fb_groups_to_display = true;

        $rootScope.displaySidebar = function() {
            var isLoggedIn = $localStorage.user && $localStorage.user.access_token;

            if( isLoggedIn && $rootScope.fb_groups_to_display )
                return true;

            var widgets_to_display = false;

            angular.forEach( $scope.widgets, function( value, key ) {

                if( !widgets_to_display )
                {
                    if( $rootScope.showWidget( value ) )
                        widgets_to_display = true;
                }
            } );

            return widgets_to_display;
        }

		$rootScope.site.configured_app = [];
		angular.forEach( details.app_configuration, function( value, key )
		{
			$rootScope.site.configured_app.push( value );
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

        $rootScope.articles_query = '';

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

	$rootScope.$watch( 'user', function( new_value, old_value )
	{

		if( new_value && new_value.id )
		{
			$rootScope.is_site_admin = $scope.isAdmin( new_value.role );
			$rootScope.is_team_member = $scope.hasAccess( new_value.role );
		}

	}, true );

	$scope.initPublicSite();
	$scope.resolve();

});