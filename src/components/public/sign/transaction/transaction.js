var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.sign.transaction", {
			url: "/transaction",
			templateUrl: "/templates/components/public/sign/transaction/transaction.html"
		} )
} );

app.controller( 'transactionAccountSetupController', function( $rootScope, $scope, $stateParams, Restangular, $state, $localStorage, ipCookie, $http )
{
	$scope.account = {};

	var $_GET = $localStorage.transaction_params;
    $rootScope.last_base_state.state = $localStorage.after_transaction_state;
    $rootScope.last_base_state.params = $localStorage.after_transaction_params;
    delete $localStorage.transaction_params;
    delete $localStorage.after_transaction_state;
    delete $localStorage.after_transaction_params;

	Restangular.all( '' ).customGET( 'user/transactionAccount/' + $_GET[ 'cbreceipt' ] ).then( function( response )
	{
		$scope.account = response;
	} );

	$scope.account.password = '';
	$scope.account.create_new_account = false;
	$scope.email_taken = false;
	$scope.verification_sent = false;
	$scope.account.verification_code = '';

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
	}

	$scope.saveAccount = function()
	{
		Restangular.all( 'user/saveTransactionAccount' ).customPOST( $scope.account ).then( function( response )
			{
				$scope.postAuth( response );

				$rootScope.modal_popup_template = false;
				delete $rootScope.$_GET[ 'cbreceipt' ];

				$rootScope.CloseExtraState();
			},
			function( response )
			{
				if( response && response.data && response.data.message && response.data.message == 'User email already exists' )
				{
					$scope.email_taken = true;
					$scope.verification_sent = true;
					$scope.verification_failed = false;
				}
				else if( response && response.data && response.data.message && response.data.message == 'Verification code invalid' )
				{
					$scope.email_taken = true;
					$scope.verification_sent = false;
					$scope.verification_failed = true;
				}
			} );
	}

	$scope.sendVerificationCode = function()
	{
		Restangular.all( 'user/sendVerificationCode' ).customPOST( $scope.account ).then( function( response )
		{
			$scope.verification_sent = true;
			$scope.account.verification_code = '';
		} );
	}

	$scope.associateAccount = function()
	{
		$scope.account.transaction = $_GET[ 'cbreceipt' ];
		Restangular.all( 'user/associateTransactionAccount' ).customPOST( $scope.account ).then( function( response )
		{
			$scope.postAuth( response );

			$rootScope.modal_popup_template = false;
			delete $rootScope.$_GET[ 'cbreceipt' ];

			$rootScope.CloseExtraState();
		} );
	}

	$scope.associateNewAccount = function()
	{
		$scope.account.transaction = $_GET[ 'cbreceipt' ];
		Restangular.all( 'user/registerTransactionAccount' ).customPOST( $scope.account ).then( function( response )
			{
				$scope.postAuth( response );

				$rootScope.modal_popup_template = false;
				delete $rootScope.$_GET[ 'cbreceipt' ];

				$rootScope.CloseExtraState();
			},
			function( response )
			{
				if( response && response.data && response.data.message && response.data.message == 'User email already exists' )
				{
					$scope.email_taken = true;
					$scope.verification_sent = true;
					$scope.verification_failed = false;
				}
				else if( response && response.data && response.data.message && response.data.message == 'Verification code invalid' )
				{
					$scope.email_taken = true;
					$scope.verification_sent = false;
					$scope.verification_failed = true;
				}
			} );
	}
} );