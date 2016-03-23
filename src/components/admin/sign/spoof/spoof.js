var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.sign.spoof",{
			url: "/spoof/:email?",
			templateUrl: "/templates/components/admin/sign/spoof/spoof.html",
			controller: "SpoofController"
		})
}); 

app.controller( 'SpoofController', function( $rootScope, $scope, toastr, ipCookie, $localStorage, $stateParams, $location, Restangular, FB, $state, $http )
{
    var auth = Restangular.all( 'auth' );
    var authorized_user = {};
    if( $localStorage.user )
    {
        authorized_user = $localStorage.user;
    }


    auth.customPOST( { user: authorized_user, email: $stateParams.email }, "spoof" ).then( function( response )
    {
        $scope.postAuth( response );
    } );

    $scope.postAuth = function( response )
    {

        if( response.id )
        {
            delete $localStorage.user;
            ipCookie.remove( 'user', { 'domain': $rootScope.app.domain, 'path': '/' } );

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
            $state.go( 'public.administrate.account.memberships' );
        }
    }
} )