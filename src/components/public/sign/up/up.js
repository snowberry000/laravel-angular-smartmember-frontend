var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.sign.up", {
			url: "/up/:hash?",
			templateUrl: "/templates/components/public/sign/up/up.html",
			controller: 'UpController'
		} )
} );

app.controller( 'UpController', function( $rootScope, $scope, toastr, ipCookie, $localStorage, $stateParams, $location, Restangular, FB, $state, $http )
{

	var auth = Restangular.all( 'auth' );
	$rootScope.page_title = "Smartmember";
	$rootScope.is_admin = true;

	$scope.message = '';
	$scope.site_logo = "http://imbmediab.s3.amazonaws.com/wp-content/uploads/2015/06/Smart-Member-Gray-Icon-Text-01.png";
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

	$scope.sendVerificationCode = function()
	{
		Restangular.all( 'user/sendVerificationCode' ).customPOST( $scope.user ).then( function( response )
		{
			$scope.verification_failed = false;
			$scope.user.verification_code = '';
		} );
	}

	$scope.register = function()
	{
		/*if($scope.user.password2!=$scope.user.password)
		 {
		 toastr({
		 message:"Passwords do not match",
		 classes: 'alert-danger',
		 templateUrl : 'templates/modals/toastrTemplate.html'
		 });
		 return;
		 }*/

		var user = $scope.user;
		delete user.password2;
		$scope.action = 1;
		if( $localStorage.hash )
		{
			user.hash = $localStorage.hash;
		}
		if( $localStorage.cbreceipt )
		{
			user.cbreceipt = $localStorage.cbreceipt;
		}
		if ($scope.validate())
		{
			auth.customPOST( user, "register" ).then( function( response )
				{
					$scope.postAuth( response );
					if( $rootScope.redirectedFromLoginMessage )
					{
						$rootScope.redirectedFromLoginMessage = false;
						window.location.href = $localStorage.accessed_url;
					}

					if($localStorage.access_pass_redirect){
						$localStorage.access_pass_redirect = null;	
						window.location.href = '/'
					}

					toastr.success( "Registered!" );

					//location.reload();

				},
				function( response )
				{
					if( response && response.data && response.data.message && response.data.message == 'User email already exists' )
					{
						$scope.email_taken = true;
						$scope.verification_failed = false;
					}
					else if( response && response.data && response.data.message && response.data.message == 'Verification code invalid' )
					{
						$scope.email_taken = true;
						$scope.verification_failed = true;
					}
				} );
		}

	};

	$scope.validate = function()
	{
		if (!$scope.user.first_name || $scope.user.first_name.length === 0)
		{
			return false;
		}
		if (!$scope.user.email || $scope.user.email.length === 0)
		{
			return false;
		}
		if (!$scope.user.password || $scope.user.password.length === 0)
		{
			return false;
		}
		return true;
	}

	$scope.registerContinue = function()
	{
		var user = $scope.user;
		$scope.cotinueRegistration = false;

		auth.customPOST( user, "usercheck" ).then( function( response )
		{
			if( response.status == "created" )
			{
				$scope.cotinueRegistration = true;
			}
			else if( response.status == "inprocess" )
			{
				window.location.href = "/sign/forgot/?error_message=inprocess registration";
				$scope.cotinueRegistration = true;
			}
			else if( response.status == "exists" )
			{
				window.location.href = "/sign/in/?error_message=exist from registration";
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
		if( $rootScope.app.subdomain == 'sm' )
		{
			window.location.href = 'http://my.smartmember.' + $rootScope.app.env;
		}
		else
		{
			if( $rootScope.isSitelessPage() )
			{
				$state.go('public.administrate.wizard', {id: 'account_wizard'});
			}
			else
			{
				$rootScope.CloseExtraState();
			}
			//$state.go( "admin.account.memberships" );
		}

	}

	$scope.$on( '$destroy', function()
	{
		//smModal.hide( '.ui.modal');
	} )
} );