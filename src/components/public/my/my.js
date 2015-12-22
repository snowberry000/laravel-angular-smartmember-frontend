var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.my", {
			url: "/",
			templateUrl: "/templates/components/public/my/my.html",
			controller: "MyController"
		} )
} );

app.controller( "MyController", function( $scope, toastr, $window, $rootScope, $state, $location, Restangular, $localStorage, smModal )
{
	console.log( "DOING THINGS");

	$scope.Init = function()
	{
		$scope.StoreVerificationHash();
		$scope.CheckForUserStatus();
	}

	$scope.RedirectToMySite = function()
	{
		Restangular.one( 'company/getUsersSitesAndTeams' ).get().then( function( response )
		{
			//$scope.loading_sites = false;

			$scope.admin_sites = [];//response.admin;
			$scope.member_sites = [];//response.member;

			var goto = '';

			if( response.admin.length > 0 && response.admin[0].sites.length > 0 )
			{
				goto = response.admin[0].sites[0].domain ? response.admin[0].sites[0].domain : response.admin[0].sites[0].subdomain + '.smartmember.' + $rootScope.app.env;
			}

			if( goto )
			{
				console.log( "GOING TO ", goto );
				window.location.href = 'http://' + goto;
				return;
			}
			else
			{
				// if we don't have a site, we should go through the setup wizard
				smModal.Show('public.admin.wizard', {id: 'account_wizard'});
				console.log( "Lets do the setup wizard!" );
			}
		} );
	}

	$scope.StoreVerificationHash = function()
	{
		if( $location.search().verification_hash )
		{
			$localStorage.verification_hash = $location.search().verification_hash;
		}
	}

	$scope.CheckForUserStatus = function()
	{
		if( !$localStorage.user )
		{
			smModal.Show('public.sign.in');
			//window.location.href = 'http://' + $rootScope.subdomain + '.' + $rootScope.app.domain + "/sign/in/";
			//return;
		}
		else
		{
			Restangular.one( 'user', $localStorage.user.id ).get().then( function( response )
			{
				$rootScope.user = response;
				$user = $rootScope.user;

				console.log( "The user: ", $user );

				if( $localStorage.verification_hash )
				{
					Restangular.one( 'user/linkAccount' ).customPOST( { 'verification_hash': $localStorage.verification_hash } ).then( function( response )
					{
						if( response.status && response.status == 'OK' )
						{
							toastr.success( 'Accounts linked' );
						}

						$scope.RedirectToMySite();
					} )

					$localStorage.verification_hash = undefined;
				}
				else
				{
					$scope.RedirectToMySite();
				}
			} );
		}

		if( !$scope.$storage.user )
		{
			//$state.go( 'public.app.login' );
		}
	}

	$scope.Init();

} );