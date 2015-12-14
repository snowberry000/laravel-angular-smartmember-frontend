app.config( function( $stateProvider, $httpProvider, $urlRouterProvider, $locationProvider )
{
	//$urlRouterProvider.otherwise("/");
	$locationProvider.html5Mode( {
		enabled: true,
		requireBase: true
	} );

	$stateProvider
		.state( 'admin.site.pages.bridge-pages', {
			url: '/bridge-pages',
            templateUrl: 'templates/admin/site/pages/bridge-pages.html',
			controller: 'adminBridgePagesController'
		} )
		.state( 'admin.site.pages.bridge-page', {
				url: '/bridge-page/:id?',
            templateUrl: 'templates/admin/site/pages/bridge-page.html',
				controller: 'adminBridgePageController',
				resolve: {
					$page: function( Restangular, $site, $stateParams )
					{
						if( $stateParams.id )
							return Restangular.one( 'bridgePage', $stateParams.id ).get();
						else
							return { site_id: $site.id, access_level_type: 4 }
					},
					$templates: function( Restangular )
					{
						return Restangular.all( 'bridgeTemplate' ).customGETLIST( 'getlist' );
					},
					$emailLists: function( Restangular, $site )
					{
						return Restangular.all( 'emailList' ).getList();
					}
				}
			} )

		.state( 'admin.site.pages.custom-pages', {
			url: '/pages',
			templateUrl: 'templates/admin/site/pages/custom-pages.html',
			controller: 'adminPagesController'
		} )
		.state( 'admin.site.pages.custom-page', {
			url: '/page/:id?',
            templateUrl: 'templates/admin/site/pages/custom-page.html',
			controller: 'adminPageController',
			resolve: {
                $next_item: function( Restangular, $site, $stateParams, $location )
				{
					if( $stateParams.id )
						return Restangular.one( 'customPage', $stateParams.id ).get();
					else if( $location.search().clone )
                    {
                        return Restangular.one( 'customPage', $location.search().clone ).get();
                    }
                    else
                    {
                        return { site_id: $site.id, access_level_type: 4, access_level_id: 0 }
                    }
                },
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'summernote'
                        }
                    ]);
                }
            }
        } )
		.state( 'admin.site.pages.core', {
			url: '/core',
			templateUrl: 'templates/admin/site/pages/core.html',
			controller: 'adminPagesCoreController'
		} )

} );
