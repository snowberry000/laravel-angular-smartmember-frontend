var app = angular.module( 'app', [ 'templates', 'restangular', 'ipCookie', 'ngStorage', 'ui.router', 'ngFileUpload', 'facebook', 'angular-loading-bar', 'ngAnimate', 'ui.bootstrap', 'cgNotify', 'cfp.loadingBar', 'ngtimeago', 'ngUrlify', 'xeditable', 'ngTagsInput', 'infinite-scroll', 'ngClipboard', 'popoverToggle', 'infinite-scroll', 'summernote', 'as.sortable' ] );


app.config( function( $httpProvider, $urlRouterProvider )
{

	$httpProvider.interceptors.push( 'httpInterceptor' );
	$urlRouterProvider.otherwise( function( $injector )
	{
		var $state = $injector.get( '$state' );

		var parts = location.hostname.split( '.' );
		var subdomain = parts.shift();

		$state.go( "app" );

	} );
} );

app.run( function( $rootScope, $localStorage, ipCookie, $http, $state, $location, Restangular, cfpLoadingBar, editableOptions )
{
	$rootScope._ = _;

	$rootScope.$location = $location;
	$rootScope.moment = moment;
	var domainParts = $location.host().split( '.' );
	var env = domainParts.pop();
	var domain = domainParts.pop() + "." + env;
	var sub = domainParts.pop();

	var $body=$(document.body);
	var _SCROLL_FIXED_CUTOFF = _SCROLL_FIXED_CUTOFF || (($( window ).height() >= 825) ? 300 : 75), _HEADER_HEIGHT = _HEADER_HEIGHT || 825;
	var _EXPERIMENT_ID = 14;
	var _HAS_STORY = _HAS_STORY;
	var _FROM_SUBDOMAIN = _FROM_SUBDOMAIN;
	if( $body.scrollTop() >= _SCROLL_FIXED_CUTOFF )
	{
		_header_carousel_active = false;
		if( !$body.hasClass( "scrolled" ) )
		{
			$body.addClass( "scrolled" )
		}
	}
	$( window ).scroll( function( a )
	{
		if( this.pageYOffset >= _SCROLL_FIXED_CUTOFF && !$body.hasClass( "scrolled" ) )
		{
			$body.addClass( "scrolled" )
		}
		else
		{
			if( this.pageYOffset < _SCROLL_FIXED_CUTOFF && $body.hasClass( "scrolled" ) )
			{
				$body.removeClass( "scrolled" )
			}
		}
		if( this.pageYOffset >= _HEADER_HEIGHT )
		{
			_header_carousel_active = false
		}
		else
		{
			_header_carousel_active = true
		}
	} );

	//Setup app configuration
	$rootScope.app = {
		"name": "Smartmember",
		"apiUrl": env == 'com' ? "https://api." + domain : "http://api." + domain,
		"appUrl": "http://" + sub + domain,
		"env": env,
		"stripe_pk": 'pk_test_nrv6z9U1KIkF1BVCFcH4bXtf',
		"domain": domain,
		"subdomain": sub
	};

	console.log($rootScope.app);

	Restangular.setBaseUrl( $rootScope.app.apiUrl );
	Restangular.setDefaultHeaders( { 'Content-Type': 'application/json' } );

	$http.defaults.useXDomain = true;

	if( !$localStorage.user && ipCookie( 'user' ) )
	{
		$localStorage.user = ipCookie( 'user' );
	}

	if( $localStorage.user && !ipCookie( 'user' ) )
	{
		ipCookie( 'user', $localStorage.user, { 'domain': domain, 'path': '/' } );
	}

	//Check for User token:
	$rootScope.$storage = $localStorage;
	$rootScope.$watch( "$storage.user.access_token", function()
	{
		if( $localStorage.user && $localStorage.user.access_token )
		{
			$http.defaults.headers.common[ 'Authorization' ] = "Basic " + $localStorage.user.access_token;
		}
	} );

	$rootScope.$on( '$stateChangeStart', function( e, toState, toParams, fromState, fromParams )
	{

		cfpLoadingBar.start();

		var isLoggedIn = $localStorage.user && $localStorage.user.access_token;

		if( isLoggedIn )
		{
			return;
		}

		var isApp = toState.name.split( '.' )[ 0 ] === "app";
		var isSign = toState.name.split( '.' )[ 0 ] === "sign";
		var isAdmin = toState.name.split( '.' )[ 0 ] === "admin";
		var isHome = toState.name.split( '.' )[ 0 ] === "home";

        if( isApp || isSign )
        {
            return;
        }

		if( isAdmin )
		{
			e.preventDefault();
			$state.go( 'app.login' );
		}

		if( isHome )
		{
			e.preventDefault();
			$state.go( 'sign.in' );
		}

	} );

	$rootScope.$on( '$stateChangeSuccess',
		function()
		{
			cfpLoadingBar.complete();
		} );

	editableOptions.theme = 'bs3';
} );


app.factory( 'httpInterceptor', function( $q, $rootScope, $injector )
{
	return {
		'request': function( config )
		{
			if(config.url instanceof String || typeof config.url ==='string'){
                var url = config.url.split('/');
                if (url[1] === 'templates'){
                    var event = "www " + url.splice(2).join(' ').replace('.html','');
                    mixpanel.track(event);
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
			var notify = $injector.get( "notify" );

			notify( { message: rejection.data.message, classes: 'alert-danger' } );
			return $q.reject( rejection );
		}
	};
} );

$(function () {

	var b="ontouchstart" in document.documentElement;
	if(b){
		$("html").addClass("touch");
		//FastClick.attach(document.body)
	}
	else{
		$("html").addClass("no_touch")
	}

});

