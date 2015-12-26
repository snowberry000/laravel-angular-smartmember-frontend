app.config( function( $httpProvider, $urlRouterProvider, $locationProvider )
{
	$locationProvider.html5Mode( {
		enabled: true,
		requireBase: true
	} );

	$httpProvider.interceptors.push( 'httpInterceptor' );

	var parts = location.hostname.split( '.' );
	var subdomain = parts.shift();

	$urlRouterProvider.when( '/', function( $injector )
	{
		var $state = $injector.get( '$state' );

		if( subdomain == "my" )
		{
			$state.go( "public.my" );
		}
		else if( subdomain == "www" )
		{
			$state.go( "public.www.home" );
		}
		else
		{
			$state.go( "public.app.home" );
		}
	} );

	$urlRouterProvider.otherwise( function( $injector )
	{
		console.log( "On otherwise" );
		var $state = $injector.get( '$state' );
		var Restangular = $injector.get( 'Restangular' );

		if( subdomain == "my" )
		{
			console.log( "Going to 'public.my' state from non-/" );
			$state.go( "public.my" );
		}
		else if( subdomain == "www" )
		{
			console.log( "Going to 'public.www' state from non-/" );
			$state.go( "public.www.home" );
		}
		else
		{
			alert( 'here' );
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
} );