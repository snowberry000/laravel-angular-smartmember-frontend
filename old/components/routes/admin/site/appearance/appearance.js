app.config( function( $stateProvider, $httpProvider, $urlRouterProvider, $locationProvider )
{
	//$urlRouterProvider.otherwise("/");
	$locationProvider.html5Mode( {
		enabled: true,
		requireBase: true
	} );

	$stateProvider
		.state( 'admin.site.appearance', {
			url: '/appearance',
			templateUrl: 'templates/admin/site/appearance/index.html',
		} )

        .state( 'admin.site.appearance.banners', {
            url: '/banners',
            templateUrl: 'templates/admin/site/appearance/banners.html',
            controller: 'adminSiteAdsController',
            resolve: {
                $ads: function( Restangular, $site )
                {
                    return Restangular.all( 'siteAds' ).getList( { site_id: $site.id, custom_ad: false } );
                }
            }
        })

		.state( 'admin.site.appearance.widgets', {
            url: '/widgets',
            templateUrl: 'templates/admin/site/appearance/widgets.html',
            controller: 'adminSiteWidgetsController',
            resolve: {
                $ads: function( Restangular, $site )
                {
                    return Restangular.all( 'siteAds' ).getList( { site_id: $site.id } );
                },
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ui.sortable'
                        }
                    ]);
                }
		}
	} )
		.state( 'admin.site.appearance.banner', {
			url: '/banner/:id?',
			templateUrl: 'templates/admin/site/appearance/banner.html',
			controller: 'adminSiteAdController',
			resolve: {
				$ad: function( Restangular, $stateParams, $site )
				{
					if( $stateParams.id )
					{
						return Restangular.one( 'siteAds', $stateParams.id ).get();
					}
					else
					{
						return {};
					}
				}
			},

		} )

		.state( 'admin.site.appearance.stats', {
			url: '/summary',
			templateUrl: 'templates/admin/site/appearance/stats.html',
			controller: 'SiteAdsSummaryController',
			resolve: {
				$ad: function( Restangular, $site )
				{
					return Restangular.all( 'siteAds' ).getList( { site_id: $site.id } );
				},
				loadPlugin: function ($ocLazyLoad) {
				    return $ocLazyLoad.load([
				        {
				            name: 'angular-flot'
				        }
				    ]);
				}
			}
		} )

		.state( 'admin.site.appearance.menus', {
			url: '/menus',
			templateUrl: 'templates/admin/site/appearance/menus.html',
			controller: 'menuNavigationController',
			resolve: {
				$menus: function( Restangular )
				{
					return Restangular.one( 'site', 'details' ).get();
				},
				loadPlugin: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'ui.sortable'
						}
					]);
				}

			}
		} )



		.state( 'admin.site.appearance.settings', {
			url: '/settings',
			templateUrl: 'templates/admin/other/appearance/settings.html',
			controller: 'siteOptionsController',
			resolve: {
				$site_options: function( Restangular )
				{
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'site_logo', 'access_deny_image', 'logo_url', 'homepage_url','sign_box_border_size','sign_box_border_color','login_button_text','register_button_text','sign_button_text_color','sign_button_color','sign_bg_image' ] );
				}
			}

		} )
		.state( 'admin.site.appearance.facebook-settings', {
			url: '/facebook-settings',
			templateUrl: 'templates/admin/other/seo_settings/admin.facebook-settings.html',
			controller: 'SeoSettingsController'
		} )

		.state( 'admin.site.appearance.directory', {
			url: '/directory',
			templateUrl: 'templates/admin/other/appearance/directory.html',
			controller: 'DirectoryListingController',
			resolve: {
				$listing: function( Restangular )
				{
					return Restangular.one( 'directory', 'siteListing' ).get();
				}
			}
		} )

} );


