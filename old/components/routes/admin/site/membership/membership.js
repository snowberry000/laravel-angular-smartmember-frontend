app.config( function( $stateProvider, $httpProvider, $urlRouterProvider, $locationProvider )
{
	//$urlRouterProvider.otherwise("/");
	$locationProvider.html5Mode( {
		enabled: true,
		requireBase: true
	} );

	$stateProvider
		.state( 'admin.site.membership', {
			url: '/membership',
			templateUrl: 'templates/admin/site/membership/index.html'
		} )

		.state( 'admin.site.membership.members', {
			url: '/members',
			templateUrl: 'templates/admin/site/membership/members.html',
			controller: 'MembersController'
		} )
		.state( 'admin.site.membership.passes', {
			url: '/passes',
			templateUrl: 'templates/admin/site/membership/passes.html',
			controller: 'AccessPassesController'
		} )
		.state( 'admin.site.membership.pass', {
				url: '/pass/:id?',
				templateUrl: 'templates/admin/site/membership/pass.html',
				controller: 'AccessPassController',
				resolve: {
					$access_pass: function( Restangular, $stateParams, $site )
					{
						if( $stateParams.id )
						{
							return Restangular.one( 'pass', $stateParams.id ).get();
						}
						return { site_id: $site.id };
					},
					roles: function( Restangular, $site )
					{
						return Restangular.all( 'role' ).customGET('', { site_id: $site.id } );
					}
				}
			} )

		.state( 'admin.site.membership.products', {
            url: '/products',
            templateUrl: 'templates/admin/site/membership/products.html',
            controller: 'AccessLevelsController'
        } )
		.state( 'admin.site.membership.product', {
			url: '/product/:id?',
			templateUrl: 'templates/admin/site/membership/product.html',
			controller: 'AccessLevelController',
			resolve: {
				$access_level: function( Restangular, $stateParams, $site )
				{
					if( $stateParams.id )
					{
						return Restangular.one( 'accessLevel', $stateParams.id ).get();
					}
					return { site_id: $site.id };
				}
				,
				$facebook_groups: function( Restangular, $site )
				{
					return Restangular.one( 'facebook' ).customGET( 'groups' );
				},
				$currency: function( Restangular )
				{
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'currency' ] );
				}
			}
		} )
		.state( 'admin.site.membership.import', {
			url: '/import',
			templateUrl: 'templates/admin/site/membership/import.html',
			controller: 'MembersImportController',
		} )

		.state( 'admin.site.membership.notices', {
			url: '/notices',
			templateUrl: 'templates/admin/site/membership/notices.html',
			controller: 'adminNotificationsController'
		} )
		.state( 'admin.site.membership.notice', {
			url: '/notice/:id?',
			templateUrl: 'templates/admin/site/membership/notice.html',
			controller: 'adminNotificationController',
			resolve: {
				$notification: function( Restangular, $stateParams, $site )
				{
					if( $stateParams.id )
					{
						return Restangular.one( 'siteNotice', $stateParams.id ).get();
					}
					return { site_id: $site.id };
				}
			}
		} )

		.state( 'admin.site.membership.transactions', {
			url: '/transactions',
			templateUrl: 'templates/admin/site/membership/transactions.html',
			controller: 'adminTransactionController'
		} )
		.state('admin.site.membership.finance_settings', {
			url: '/finance/settings',
			templateUrl: 'templates/admin/other/finance/settings.html',
			controller: 'siteOptionsController',
			resolve: {
				$site_options : function(Restangular){
					return Restangular.all('siteMetaData').customGETLIST("getOptions", ['currency']);
				}
			}
		})
		.state( 'admin.site.membership.reporting', {
				url: '/reporting',
				templateUrl: 'templates/admin/site/membership/reporting.html',
				controller: 'MembersSummaryController',
				resolve: {
					$summary: function( Restangular, $site )
					{
						return Restangular.all( 'role' ).customGET( 'summary' );
					}
				}
			} )


		.state( 'wallboard', {
			url: '/wallboard',
			templateUrl: 'templates/admin/site/membership/wallboard.html',
			controller: 'adminWallboardController',
			resolve: {
				$site: function( Restangular )
				{
					return Restangular.one( 'site', 'details' ).get();
				}
			}
		} )

} );
