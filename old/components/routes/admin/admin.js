app.config( function( $stateProvider, $httpProvider, $urlRouterProvider, $locationProvider )
{
	//$urlRouterProvider.otherwise("/");
	$locationProvider.html5Mode( {
		enabled: true,
		requireBase: true
	} );

	$stateProvider
		.state( 'admin', {
			url: '/admin',
			templateUrl: 'templates/admin/admin.html',
			controller: 'AdminController',
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
				}
			}
		} )

		.state( 'admin.finance', {
			url: '/finance',
			templateUrl: 'templates/admin/other/finance.html',
		} )
		.state( 'admin.finance.payment-gateways', {
			url: '/payment-gateways',
			templateUrl: 'templates/admin/other/finance/payment-gateways.html',
			controller: 'adminPaymentGatewaysController',

		} )
		.state( 'admin.finance.summary', {
			url: '/summary',
			templateUrl: 'templates/admin/other/finance/revenue-summary.html',
			controller: 'adminRevenueSummaryController',
			resolve: {
				$summary: function( Restangular, $site )
				{
					return Restangular.all( 'transaction' ).customGET( 'summary' );
				}
			}
		} )
		.state( 'admin.finance.transactions', {
			url: '/transactions',
			templateUrl: 'templates/admin/other/finance/transactions.html',
			controller: 'adminTransactionController',
			resolve: {
				$transactions: function( Restangular, $site )
				{
					return Restangular.all( 'transaction' ).getList( { site_id: $site.id } );
				}
			}
		} )
		.state( 'admin.finance.settings', {
			url: '/settings',
			templateUrl: 'templates/admin/other/finance/settings.html',
			controller: 'siteOptionsController',
			resolve: {
				$site_options: function( Restangular )
				{
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'currency' ] );
				}
			}
		} )

		.state( 'admin.comingsoon', {
			url: '/coming-soon',
			templateUrl: 'templates/admin/other/coming-soon.html',
		} )

		.state( 'admin.siteoptions', {
			url: '/site-options',
			templateUrl: 'templates/admin/other/appearance/admin.site-options.html',
			controller: 'siteOptionsController',
			resolve: {
				$site_options: function( Restangular )
				{
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'site_logo', 'access_deny_image', 'logo_url' ] );
				}

			}
		} )


		.state( 'admin.tracking-code', {
			url: '/tracking-code',
			templateUrl: 'templates/admin/other/members/member-dashboard.html',
			controller: 'MemberDashboardController',
		} )

		.state( 'admin.stripe', {
			url: '/stripe',
			controller: 'StripeConnectCtrl'
		} )


		.state( 'admin.revenue-dashboard', {
			url: '/revenue-dashboard',
			templateUrl: 'templates/admin/other/finance/admin.revenue-dashboard.html',
			controller: 'adminTransactionController',
			resolve: {
				$transactions: function( Restangular, $site )
				{
					return Restangular.all( 'transaction' ).getList( { site_id: $site.id } );
				}
			}
		} )

		.state( 'admin.marketing', {
			url: '/marketing',
			templateUrl: 'templates/admin/other/marketing.html'
		} )





		.state( 'admin.marketing.tracking', {
			url: '/tracking',
			templateUrl: 'templates/admin/other/marketing/tracking.html',
			controller: 'siteOptionsController',
			resolve: {
				$site_options: function( Restangular )
				{
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'google_analytics_id', 'facebook_retargetting_pixel', 'facebook_conversion_pixel', 'bing_id' ] );
				}
			}
		} )


} );
