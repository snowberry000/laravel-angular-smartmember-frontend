var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.spoof",{
			url: "/spoof/:email?",
			templateUrl: "/templates/components/public/sign/spoof/spoof.html",
			controller: "SpoofController"
		})
}); 

app.controller( 'SpoofController', function( $rootScope, $scope, toastr, ipCookie, $localStorage, $stateParams, $location, Restangular, FB, $state, $http, smModal )
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

            $state.go( 'public.app.home' );
            smModal.Show( 'public.administrate.team.sites' );
        }
    }
} )