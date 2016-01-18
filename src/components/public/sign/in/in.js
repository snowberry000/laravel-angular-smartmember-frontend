var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.sign.in", {
			url: "/in/:hash?",
			templateUrl: "/templates/components/public/sign/in/in.html",
			controller: 'InController'
		} )
} );

app.controller( 'InController', function( $rootScope, $scope, $timeout, toastr, ipCookie, $localStorage, $stateParams, $location, Restangular, FB, $state, $http )
{

	$rootScope.page_title = "Smart member";
	$rootScope.is_admin = true;
	if( $location.search().message )
	{
		$rootScope.redirectedFromLoginMessage = true;
	}

	//$scope.site_logo = "http://imbmediab.s3.amazonaws.com/wp-content/uploads/2015/06/Smart-Member-Gray-Icon-Text-01.png";
	$scope.action = 0;
	$scope.login_type = "facebook";
	$scope.user = {};
	$scope.hash = '';
	$scope.current_url = $rootScope.app.domain.indexOf( 'smartmember' ) != -1 ? $rootScope.app.subdomain + '.' + $rootScope.app.domain : $rootScope.app.domain;


	if( $stateParams.hash )
	{
		$localStorage.hash = $stateParams.hash;
	}
	if( $location.search().cbreceipt )
	{
		$localStorage.cbreceipt = $location.search().cbreceipt;
	}

	if( $location.search().message )
	{
		toastr.success( $location.search().message );
	}

	if( $location.search().error_message )
	{
		if( $location.search().error_message == "Email address already taken" )
		{
			$scope.account_exist = true;
		}
		if( $location.search().error_message == "exist from registration" )
		{
			$scope.register_exist = true;
		}

	}

	if( $stateParams.reset && $stateParams.reset == 1 )
	{
		$scope.reset_sent = 1;
	}

	$scope.login = function()
	{
		var user = $scope.user;
		if( $localStorage.hash )
		{
			user.hash = $localStorage.hash;
		}
		if( $localStorage.cbreceipt )
		{
			user.cbreceipt = $localStorage.cbreceipt;
		}

		Restangular.all( 'auth' ).customPOST( user, "login" ).then( function( response )
		{

			$scope.postAuth( response );
			if( $location.search().message )
			{
				$rootScope.redirectedFromLoginMessage = false;
				window.location.href = $localStorage.accessed_url;
			}
			else if( $stateParams.close && $localStorage.add_user_to_site )
			{
				$scope.$storage.user = response;
				//close( response );
			}
		} );
	};

	$scope.postAuth = function( response )
	{
		$scope.$storage.user = response;

		$http.defaults.headers.common[ 'Authorization' ] = "Basic " + response.access_token;
		ipCookie( 'user', JSON.stringify( response ), { 'domain': $scope.app.domain, 'path': '/' } );

		if( $localStorage.hash )
		{
			$localStorage.hash = false;
		}
		if( $localStorage.cbreceipt )
		{
			$localStorage.cbreceipt = false;
		}
		$rootScope.first_login_view = true;

		Restangular.one( 'user', $localStorage.user.id ).get().then( function( response )
		{
			if( false )// || $scope.isAgentOrGreater( response ) )
			{
				$state.go( 'admin.site.dashboard' );
				return;
			}
			else
			{
				if( $state.current.name == 'public.sign.in' || $state.current.name == 'public.sign.in2' )
				{
					// $state.transitionTo($state.current , $stateParams , {
					//    reload: 'public.app' , inherit : false , location : false
					// });
					$state.go( 'public.app.site.home', { show_modal: false }, { reload: true, location: false } );

				}
				else
				{
					$rootScope.modal_popup_template = false;
					//location.reload(true);
					console.log( 'current state', $state.current.name );

					$rootScope.CloseExtraState();

					return;
				}
			}
		} )
	}

	$scope.isAgentOrGreater = function( $user )
	{
		$role = _.find( $user.role, function( r )
		{
			return r.site_id == $scope.site.id;
		} );

		if( typeof $role == 'undefined' )
		{
			$role = _.find( $user.role, function( r )
			{
				return r.site_id == $site.id;
			} );
		}

		if( typeof $role == 'undefined' )
		{
			return;
		}

		$role_type = Math.min.apply( Math, $role.type.map( function( t )
		{
			return t.role_type;
		} ) );

		if( $role_type <= 5 )
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	$scope.$on( '$destroy', function()
	{
		//smModal.hide( '.ui.modal');
	} )
} );