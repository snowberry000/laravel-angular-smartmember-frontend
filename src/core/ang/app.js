var app = angular.module( 'app', [
	'ui.router',                    // Routing
	'oc.lazyLoad',                  // ocLazyLoad
	'pascalprecht.translate',       // Idle timer
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
	'as.sortable',
	'xeditable',
	'ui.footable',
	'ngAnimate',
	'toastr',
	'timer',
	'localytics.directives',
	'ngBusy',
	'angularModalService',
    'ngDragDrop'
] );


app.run( function( $rootScope, $localStorage, ipCookie, smModal, smSidebar, $http,  $state, $stateParams, $location, Restangular, cfpLoadingBar, editableOptions )
{
	$rootScope._ = _;
	$calledurl = window.location.host;
	$rootScope.subdomain = $calledurl.split( '.' )[ 0 ];
	$rootScope.$location = $location;
	$rootScope.moment = moment;
	$rootScope.$state = $state;
	$rootScope.smModal = smModal;
	$rootScope.smSidebar = smSidebar;

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
		"subdomain": sub
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

	if( $_GET[ 'cbreceipt' ] )
	{
		if( !$localStorage.user )
		{
			var modalInstance = $modal.open( {
				templateUrl: 'templates/modals/transactionRegistration.html',
				controller: 'signModalController',
				resolve: {
					account: function( Restangular )
					{
						return Restangular.all( '' ).customGET( 'user/transactionAccount/' + $_GET[ 'cbreceipt' ] );
					}
				}
			} );

			modalInstance.result.then( function()
			{
				$state.go( $state.current, $stateParams, { reload: true } );
			} );
		}
		else
		{
			$http.defaults.headers.common[ 'Authorization' ] = "Basic " + $localStorage.user.access_token;
			Restangular.all( '' ).customGET( 'user/transactionAccess/' + $_GET[ 'cbreceipt' ] ).then( function( response )
			{
				location.href = location.href.substr( 0, location.href.indexOf( '?' ) );
			} );
		}
	}

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

    $rootScope.available_widgets = [
        'text',
        'banner'
    ];
} );




