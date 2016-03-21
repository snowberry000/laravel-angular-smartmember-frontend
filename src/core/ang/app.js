var app = angular.module( 'app', [
	'ui.router',                    // Routing
	'oc.lazyLoad',                  // ocLazyLoad
	'pascalprecht.translate',       // Idle timer
	'ngSanitize',                    // ngSanitize
	'cfp.loadingBar',
	'restangular',
	'ipCookie',
	'ngStorage',
	'facebook',
	'cgNotify',
	'ngFileUpload',
	'angular-spinkit',
	'angularSpectrumColorpicker',
	'oitozero.ngSweetAlert',
	'froala',
	'as.sortable',
	'xeditable',
	'ui.footable',
	'ngAnimate',
	'toastr',
	'timer',
	'ngBusy',
	'angularModalService',
	'ngDragDrop',
	'angular-flot',
	'chart.js',
	'infinite-scroll',
	'ui.sortable',
	'angularUtils.directives.dirPagination',
	'ct.ui.router.extras',
	'720kb.socialshare',
	'ngUrlify'
] );

String.prototype.isCustomDomain = function()
{
	return this.match( /^(?:[a-z0-9\-]{1,63})?\.smartmember\.(?:com|in|dev|soy|pro|co)$/i ) ? false : true;
}

app.config( function( FacebookProvider )
{
	FacebookProvider.init( {
		loadSDK: false
	} );
} );

app.run( function( $rootScope, $localStorage, editableThemes, ipCookie, smModal, smSidebar, $http, $state, $stateParams, $location, Restangular, cfpLoadingBar, editableOptions )
{
	$rootScope._ = _;
	$calledurl = window.location.host;
	$rootScope.subdomain = $calledurl.split( '.' )[ 0 ];
	$rootScope.$location = $location;
	$rootScope.moment = moment;
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	$rootScope.smModal = smModal;
	$rootScope.smSidebar = smSidebar;

	$rootScope.onCustomDomain = function()
	{
		return location.host.isCustomDomain();
	}

	$rootScope.nonProductionTLDs = [ 'dev', 'in', 'soy', 'co' ];

	var domainParts = $location.host().match( /^([a-z0-9\-]{1,63})?\.smartmember\.(com|in|dev|soy|pro|co)$/i );
	var env = null;
	var sub = null;
	var rootDomain = null;
	var domain = null;
	var appUrl = $location.host();

	if( domainParts )
	{
		env = domainParts[ 2 ];
		sub = domainParts[ 1 ];

		domain = 'smartmember.' + env;
	}
	else
	{
		domainParts = $location.host().split( '.' );
		env = domainParts.pop();

		if( env.length < 3 && domainParts.length > 1 && domainParts[ domainParts.length - 1 ].length < 4 )
		{
			var next_env = domainParts.pop();

			env = next_env + '.' + env;
		}

		sub = domainParts[ 0 ];

		domain = appUrl;
	}

	if( $rootScope.nonProductionTLDs.indexOf( env ) == -1 )
	{
		env = 'com';
	}

	rootDomain = 'smartmember.' + env;

	var apiURL = "http" + ( $rootScope.nonProductionTLDs.indexOf( env ) == -1 ? 's' : '') + "://api." + rootDomain;

	$arr = location.pathname.split( '/' );

	if( sub && sub == 'my' )
	{
		if( !$localStorage.user && $arr[ 1 ] != 'sign' )
		{
			//window.location.href = "http://" + location.hostname + "/sign/in/";
			//return;
		}
	}

	if( ($arr[ 1 ] != "sign") )
	{
		$localStorage.accessed_url = window.location.href;
	}

	function message( to, toP, from, fromP )
	{
		return from.name + angular.toJson( fromP ) + " -> " + to.name + angular.toJson( toP );
	}

	$rootScope.$on( "$stateChangeStart", function( evt, to, toP, from, fromP )
	{
		console.log( "Start:   " + message( to, toP, from, fromP ) );
	} );
	$rootScope.$on( "$stateChangeSuccess", function( evt, to, toP, from, fromP )
	{
		console.log( "Success: " + message( to, toP, from, fromP ) );
	} );
	$rootScope.$on( "$stateChangeError", function( evt, to, toP, from, fromP, err )
	{
		console.log( "Error:   " + message( to, toP, from, fromP ), err );
	} );

	$rootScope.$on( '$stateChangeStart'
		, function( event, toState, toParams, fromState, fromParams )
		{
			console.log( fromState.name );


			window.Intercom( 'update' );

			var isAuthenticationRequired = toState.data
					&& toState.data.requiresLogin
					&& !($localStorage.user && $localStorage.user.id)
				;

			if( isAuthenticationRequired )
			{
				$localStorage.redirect = toState.data.state;
				console.log( "setting " + $localStorage.redirect );
				event.preventDefault();
				window.location.href = $rootScope.app.appUrl + "/sign/in/?message=a valid access token is required";
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
	editableThemes[ 'default' ].submitTpl = '<button type="submit"><span class="fa fa-check"></span></button>';
	editableThemes[ 'default' ].cancelTpl = '<button type="button" ng-click="$form.$cancel()"><span class="fa fa-times" ></span></button>';


	$rootScope.apiURL = apiURL;
	//Setup app configuration
	$rootScope.app = {
		"name": "Smartmember",
		"apiUrl": apiURL,
		"rootDomain": rootDomain,
		"appUrl": 'http://' + appUrl,
		"env": env,
		"rootEnv": apiURL.split( '.' ).pop(),
		"stripe_pk": 'pk_live_tdjHKO92mUyjNu9fWuMGNEQj',
		"domain": domain,
		"subdomain": sub
	};

	if( location.href.indexOf( '?theme_options' ) > -1 )
	{
		$rootScope.app.show_engine = true;
	}

	if( location.href.indexOf( '?vimeo' ) > -1 )
	{
		$localStorage.open_vimeo_modal = true;
		$location.search( 'vimeo', null )
	}
	if( location.href.indexOf( '?new' ) > -1 )
	{
		$localStorage.open_sites_wizard_modal = true;
		$location.search( 'new', null )
	}
	else if( location.href.indexOf( '?signup' ) != -1 )
	{
		$localStorage.open_signup_modal = true;
		$location.search( 'signup', null )
	}

	if( location.href.indexOf( '?stripe' ) > -1 )
	{
		$localStorage.open_stripe_modal = true
		$location.search( 'stripe', null );
	}
	else if( location.href.indexOf( '?signin' ) != -1 )
	{
		$localStorage.open_signin_modal = true;
		$location.search( 'signin', null )
	}
	else if( location.href.indexOf( '?forgot' ) != -1 )
	{
		$localStorage.open_forgot_modal = true;
		$location.search( 'forgot', null )
	}
	else if( location.href.indexOf( '?reset' ) != -1 )
	{
		if( !$localStorage.user )
		{
			$localStorage.open_reset_modal = true;
		}
		$location.search( 'reset', null )
	}
	else if( location.href.indexOf( '?unsubscribe' ) != -1 )
	{
		$localStorage.open_unsubscribe_modal = true;
		$localStorage.unsubscribe_parameters = $location.search();

		$location.url( $location.path() );

	}
	else if( location.href.indexOf( '?speedblogging' ) != -1 )
	{
		$localStorage.open_speedblogging_modal = true;
		$rootScope.$_GET = $location.search();
	}

	Restangular.setBaseUrl( $rootScope.app.apiUrl );
	Restangular.setDefaultHeaders( { 'Content-Type': 'application/json' } );


	$http.defaults.useXDomain = true;
	delete $localStorage.user;
	$localStorage.user = ipCookie( 'user' );

	var getUrlVars = function()
	{
		var vars = {};
		var parts = window.location.href.replace( /[?&]+([^=&]+)=([^&]*)/gi, function( m, key, value )
		{
			vars[ key ] = decodeURIComponent( value );
		} );
		return vars;
	}

	var $_GET = getUrlVars();

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
				$state.go( 'admin.account.memberships' );
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
			window.location.href = 'http://' + location.hostname + "?signin";
			//$state.go('sign.in',{message: 'a valid access token is required'});
		}

		if( isHome )
		{
			e.preventDefault();
			window.location.href = 'http://' + location.hostname + "?signin";
			//$state.go('sign.in');
		}

	} );

	$rootScope.$on( '$stateChangeSuccess',
		function()
		{
			cfpLoadingBar.complete();
		} );

	$rootScope.available_widgets = [
		{
			type: 'text',
			display_name: 'Text',
			description: 'Set custom HTML/Text to display in the sidebar.'
		},
		{
			type: 'banner',
			display_name: 'Banner',
			description: 'Choose one of your banners to display.'
		},
		{
			type: 'socialshare',
			display_name: 'Social Share',
			description: 'Add social sharing buttons.'
		},
		{
			type: 'blog_categories',
			display_name: 'Blog Categories',
			description: 'Add blog categories widget in the sidebar'
		},
	];
} );


