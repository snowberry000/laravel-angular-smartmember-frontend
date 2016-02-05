var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.jv",{
			url: "/jv",
			templateUrl: "/templates/components/public/app/admin/jv/jv.html",
			controller: "JvController"
		})
}); 

app.controller("JvController", function ($scope, $rootScope , $localStorage,$state,  Restangular, toastr) {
    if( !$rootScope.site || $rootScope.site.capabilities.indexOf( 'manage_content' ) == -1 )
        $state.go('public.app.site.home');

	if($rootScope.is_not_allowed){
	    $state.go('public.administrate.team.dashboard');
	    return false;
	}
});