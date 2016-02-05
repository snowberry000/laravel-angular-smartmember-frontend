var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin",{
			url: "/admin",
			sticky: true,
			abstract: true,
			views: {
				'admin': {
					templateUrl: "/templates/components/public/app/admin/admin.html",
					controller: "AppAdminController"
				}
			},
			resolve: {
				$user: function( Restangular, $localStorage )
				{
                    if( $localStorage.user && $localStorage.user.id )
					    return Restangular.one( 'user', $localStorage.user.id ).get();
                    else
                        return Restangular.all('user').getList();//this is purely to get a 401 error
				}

			}
		})
}); 

app.controller("AppAdminController", function ( $scope,$user,$rootScope ) {
$rootScope.user =$user;

});