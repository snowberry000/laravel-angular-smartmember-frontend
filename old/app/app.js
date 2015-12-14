var app = angular.module( 'app', [
	'ui.router',                    // Routing
	'oc.lazyLoad',                  // ocLazyLoad
	'ui.bootstrap',                 // Ui Bootstrap
	'pascalprecht.translate',                      // Idle timer
	'ngSanitize',                    // ngSanitize
	'cfp.loadingBar',
	'restangular',
	'ipCookie',
	'ngStorage',
	'ngUrlify',
	'facebook',
	'cgNotify',
	'ngFileUpload',
	'angular-spinkit',
	'angularSpectrumColorpicker',
	'oitozero.ngSweetAlert',
	'froala',
	'ui.bootstrap.popover',
	'as.sortable',
	'xeditable',
	'ui.footable',
	'ngAnimate',
	'toastr',
	'timer',
	'localytics.directives',
	'ui-iconpicker',
	'ngBusy'
]);

app.config( function( toastrConfig, $httpProvider, $urlRouterProvider, $translateProvider )
{

	angular.extend( toastrConfig, {
		positionClass: 'toast-top-right',
		preventOpenDuplicates: true,
		closeButton: true,
		progressBar: true,
		onclick: null,
		timeOut: '4000',
		showDuration: '400',
		hideDuration: '1000',
		extendedTimeOut: '1000',
		iconClasses: {
			error: 'toast-error',
			info: 'toast-info',
			success: 'toast-success',
			warning: 'toast-warning'
		},
		showEasing: 'swing',
		hideEasing: 'linear',
		showMethod: 'fadeIn',
		hideMethod: 'fadeOut'
	} );

	$httpProvider.interceptors.push( 'httpInterceptor' );
	var parts = location.hostname.split( '.' );
	var subdomain = parts.shift();
	if( subdomain == "my" )
	{
		$urlRouterProvider.when( '/', function( $injector )
		{
			var $rootScope = $injector.get( '$rootScope' );
			if( $rootScope.$storage.user && $rootScope.$storage.user.access_token )
			{
				if( $rootScope.$storage.user.company_id != 0 )
				{
					return '/admin/account/teams';
				}
				else
				{
					return '/admin/account/memberships'
				}

			}
			else
			{
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
} );

app.value( 'froalaConfig', {
	heightMin: 400,
	key: 'sCHCPa1XQVZFSHSa1C==',
	fontSize: (function()
	{
		var arr = [];
		for( var i = 1; i <= 100; i++ )
		{
			arr.push( i );
		}

		return arr;
	})(),
	fontFamily: {
		'Arial,Helvetica,sans-serif': 'Arial',
		'Georgia,serif': 'Georgia',
		'Impact,Charcoal,sans-serif': 'Impact',
		'Tahoma,Geneva,sans-serif': 'Tahoma',
		"'Times New Roman',Times,serif": 'Times New Roman',
		'Verdana,Geneva,sans-serif': 'Verdana'
	},
	toolbarButtons: [ 'fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'fontFamily', 'fontSize', '|', 'color', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'quote', 'insertHR', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html' ],
	imageUploadURL: (function()
	{
		var domainParts = location.host.split( '.' );

		//this is here to account for country second level domains such as .co.uk, otherwise those would break
		if( domainParts.length > 2 )
		{
			var env = domainParts.pop();
			var domain = domainParts.pop();

			if( env.length < 3 && domain.length <= 3 )
			{
				env = domain + "." + env;
				domain = domainParts.pop();
			}

			domain = domain + "." + env;
		}
		else
		{
			var env = domainParts.pop();
			var domain = domainParts.pop() + "." + env;
		}

		var apiURL = "http" + (env == 'site' || env == 'com' || env == 'org' || env == 'info' ? 's' : '') + "://api." + (domain.indexOf( 'smartmember' ) < 0 ? 'smartmember.com' : domain);

		return apiURL + '/utility/upload';
	})(),
	imageUploadMethod: 'POST',
	fileUploadURL: (function()
	{
		var domainParts = location.host.split( '.' );

		//this is here to account for country second level domains such as .co.uk, otherwise those would break
		if( domainParts.length > 2 )
		{
			var env = domainParts.pop();
			var domain = domainParts.pop();

			if( env.length < 3 && domain.length <= 3 )
			{
				env = domain + "." + env;
				domain = domainParts.pop();
			}

			domain = domain + "." + env;
		}
		else
		{
			var env = domainParts.pop();
			var domain = domainParts.pop() + "." + env;
		}

		var apiURL = "http" + (env == 'site' || env == 'com' || env == 'org' || env == 'info' ? 's' : '') + "://api." + (domain.indexOf( 'smartmember' ) < 0 ? 'smartmember.com' : domain);

		return apiURL + '/utility/upload';
	})(),
	fileUploadMethod: 'POST',
	requestWithCORS: false
} );

app.run( function( $rootScope, $localStorage, ipCookie, smModal, $http, $modal, $state, $stateParams, $location, Restangular, cfpLoadingBar, editableOptions )
{

	$rootScope._ = _;
	$calledurl = window.location.host;
	$rootScope.subdomain = $calledurl.split( '.' )[ 0 ];
	$rootScope.$location = $location;
	$rootScope.moment = moment;
	$rootScope.$state = $state;
	$rootScope.smModal = smModal;


	var domainParts = $location.host().split( '.' );

	console.log( domainParts );

	//this is here to account for country second level domains such as .co.uk, otherwise those would break
	if( domainParts.length > 2 )
	{
		var env = domainParts.pop();
		var domain = domainParts.pop();

		if( env.length < 3 && domain.length <= 3 )
		{
			env = domain + "." + env;
			domain = domainParts.pop();
		}

		domain = domain + "." + env;
	}
	else
	{
		var env = domainParts.pop();
		var domain = domainParts.pop() + "." + env;
	}
	var sub = domainParts.pop();

	$arr = location.pathname.split( '/' );
	if( ($arr[ 1 ] != "sign") )
	{
		$localStorage.accessed_url = window.location.href;
	}

	$rootScope.$on( '$stateChangeStart'
		, function( event, toState, toParams, fromState, fromParams )
		{
			console.log( fromState.name );

			var isAuthenticationRequired = toState.data
					&& toState.data.requiresLogin
					&& !($localStorage.user && $localStorage.user.id)
				;

			if( isAuthenticationRequired )
			{
				$localStorage.redirect = toState.data.state;
				console.log( "setting " + $localStorage.redirect );
				event.preventDefault();
				window.location.href = 'http://' + ( $rootScope.app.domain.indexOf( 'smartmember.' ) == -1 ? '' : $rootScope.subdomain + '.' ) + $rootScope.app.domain + "/sign/in/?message=a valid access token is required";
			}
			//-- refactoring required
			if( fromState.name == "sign.in" && $localStorage.redirect )
			{
				$link = $localStorage.redirect;
				$localStorage.redirect = null;
				event.preventDefault();
				$state.go( $link );

			}
		} );
//
	editableOptions.theme = 'bs3';

	var apiURL = "http" + (env == 'site' || env == 'com' || env == 'org' || env == 'info' ? 's' : '') + "://api." + (domain.indexOf( 'smartmember' ) < 0 ? 'smartmember.com' : domain);

	//TODO: FIX THIS
	//var rootDomain = 'smartmember.dev';
	var rootDomain = domain;

	$rootScope.apiURL = apiURL;
	//Setup app configuration
	$rootScope.app = {
		"name": "Smartmember",
		"apiUrl": apiURL,
		"rootDomain": rootDomain,
		"appUrl": sub ? "http://" + sub + "." + domain : "http://" + domain,
		"env": env,
		"stripe_pk": 'pk_live_tdjHKO92mUyjNu9fWuMGNEQj',
		"domain": domain,
		"subdomain": sub,
		"colorpicker_options": colorpicker_options // TODO: certainly not the right place for this
	};

	if( location.href.indexOf( '?theme_options' ) > -1 )
	{
		$rootScope.app.show_engine = true;
	}

	Restangular.setBaseUrl( $rootScope.app.apiUrl );
	Restangular.setDefaultHeaders( { 'Content-Type': 'application/json' } );


	$http.defaults.useXDomain = true;
	delete $localStorage.user;
	$localStorage.user = ipCookie( 'user' );

	// if (! $localStorage.user && ipCookie('user')) {
	//     $localStorage.user = ipCookie('user');
	// }

	// if ( $localStorage.user && ! ipCookie('user') ) {
	//     ipCookie('user', $localStorage.user, {'domain' : domain, 'path' : '/'});
	// }

	//Check for User token:
	$rootScope.$storage = $localStorage;
	$rootScope.$watch( "$storage.user.access_token", function()
	{
		if( $localStorage.user && $localStorage.user.access_token )
		{
			//Set Mixpanel
			if( $rootScope.app.env != 'dev' )
			{
				//mixpanel.identify($localStorage.user.id);
				//mixpanel.people.set({
				//    "$first_name": $localStorage.user.first_name,
				//    "$last_name": $localStorage.user.last_name,
				//    "$email": $localStorage.user.email,    // only special properties need the $
				//    "$created": $localStorage.user.created_at,
				//    "$last_login": new Date(),         // properties can be dates...
				// });
			}
			$http.defaults.headers.common[ 'Authorization' ] = "Basic " + $localStorage.user.access_token;
		}
	} );
	$rootScope.$watch( "$storage.homepage_url", function()
	{
		$rootScope.homepage_url = $localStorage.homepage_url;
	} );

	$rootScope.$on( '$stateChangeStart', function( e, toState, toParams, fromState, fromParams )
	{

		cfpLoadingBar.start();
		$rootScope.not_homepage_setting = true;

		var isLoggedIn = $localStorage.user && $localStorage.user.access_token;

		if( isLoggedIn )
		{
			if( toState.url == '/admin' )
			{
				e.preventDefault();
				$state.go( 'admin.account.memberships' )
				return;
			}
			else
			{
				return;
			}
		}

		var isApp = toState.name.split( '.' )[ 0 ] === "app";
		var isSign = toState.name.split( '.' )[ 0 ] === "sign";
		var isAdmin = toState.name.split( '.' )[ 0 ] === "admin";
		var isHome = toState.name.split( '.' )[ 0 ] === "home";

		if( isApp || isSign )
		{
			return;
		}

		if( isAdmin || toState.name == 'wallboard' )
		{
			e.preventDefault();
//            $location.path('/sign/in/').search({message: 'a valid access token is required'});
			window.location.href = 'http://' + location.hostname + "/sign/in/?message=a valid access token is required ";
			//$state.go('sign.in',{message: 'a valid access token is required'});
		}

		if( isHome )
		{
			e.preventDefault();
			window.location.href = 'http://' + location.hostname + "/sign/in/?message=a valid access token is required "
			//$state.go('sign.in');
		}

	} );

	$rootScope.$on( '$stateChangeSuccess',
		function()
		{
			cfpLoadingBar.complete();
		} );

} );


app.factory( 'httpInterceptor', function( $q, $rootScope, $injector, $location )
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
				window.location.href = 'http://help.' + $rootScope.app.rootDomain + '/domain-not-found';
				return [];
			}
			if( rejection.status == 401 && $location.path() != '/sign/in/' )
			{
				// $rootScope.accessed_url;
				// $location.path('/sign/in/').search({redirectURL: $rootScope.accessed_url});
				$location.path( '/sign/in/' ).search( { message: 'a valid access token is required' } );
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

