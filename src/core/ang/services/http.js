var app = angular.module('app');

app.factory( 'httpInterceptor', function( $q, $rootScope, $injector, $location, $localStorage, ipCookie )
{
	return {
		'request': function( config )
		{
			if( config.url instanceof String || typeof config.url === 'string' )
			{
				var url = config.url.split( '/' );
				if( url[ 1 ] === 'templates' )
				{
					var event = url.splice( 2 ).join( ' ' ).replace( '.html', '' );
					if( $rootScope.app.env != 'dev' )
					{
						//mixpanel.track(event);
					}
				}
			}

			return config || $q.when( config );
		},
		'response': function( response )
		{
			return response;
		},
		'requestError': function( rejection )
		{
			return $q.reject( rejection );
		},
		'responseError': function( rejection )
		{
			var toastr = $injector.get( "toastr" );
			console.log( rejection )
			$rootScope.loaded = true;
			if( rejection.status == 405 )
			{
				window.location.href = '/not-found';
				return [];
			}
			if( rejection.status == 406 )
			{
				window.location.href = 'http://training.' + $rootScope.app.rootDomain + '/domain-not-found';
				return [];
			}
			if( rejection.status == 401 && !$localStorage.open_signin_modal )
			{
                delete $localStorage.user;
                ipCookie.remove('user', {'domain' : $rootScope.app.domain, 'path' : '/'});
				location.href = '/sign/in/';
				return [];
			}
			else
			{
				if( rejection.data && rejection.data.message )
				{
					toastr.error( rejection.data.message );
					console.log( rejection.data.message );
				}
			}

			return $q.reject( rejection );
		}
	};
} );