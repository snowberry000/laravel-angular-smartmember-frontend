app.config(function($httpProvider, $urlRouterProvider,$locationProvider){
	$locationProvider.html5Mode( {
		enabled: true,
		requireBase: true
	} );

	$httpProvider.interceptors.push( 'httpInterceptor' );
		
	var parts = location.hostname.split( '.' );
	var subdomain = parts.shift();
	if( subdomain == "my" )
	{
		$urlRouterProvider.when( '/', function($injector){
			var $rootScope = $injector.get('$rootScope');
			if($rootScope.$storage.user && $rootScope.$storage.user.access_token){
				if ($rootScope.$storage.user.company_id != 0)
				{
					return '/admin/account/teams';
				} else {
					return '/admin/account/memberships'
				}

			}else{
				return '/sign/in';
			}
		} );
	}

	$urlRouterProvider.otherwise( function( $injector )
	{
		var $state = $injector.get( '$state' );
		var Restangular = $injector.get( 'Restangular' );

		if( subdomain == "my" )
		{
			$state.go( "admin.account.memberships" );
		}
		else
		{
			var parts = location.pathname.split( '/' );
			if( parts.length == 2 || ( parts.length == 3 && parts[ 2 ] == '') )
			{
				Restangular.one( 'permalink', parts[ 1 ] ).get().then( function( response )
				{
					switch( response.type )
					{
						case "lessons":
							$state.go( 'public.app.lesson', { permalink: parts[ 1 ] }, { location: false } );
							break;
						case "custom_pages":
							$state.go( 'public.app.page', { permalink: parts[ 1 ] }, { location: false } );
							break;
						case "download_center":
							$state.go( 'public.app.download', { permalink: parts[ 1 ] }, { location: false } );
							break;
						case "livecasts":
							$state.go( 'public.app.livecast', { permalink: parts[ 1 ] }, { location: false } );
							break;
						case "posts":
							$state.go( 'public.app.post', { permalink: parts[ 1 ] }, { location: false } );
							break;
						case "support_articles":
							$state.go( 'public.app.support-article', { permalink: parts[ 1 ] }, { location: false } );
							break;
						case "bridge_bpages":
							$state.go( 'bridgepage', { permalink: parts[ 1 ] }, { location: false } );
					}
				} );
			}
		}
	} );
});