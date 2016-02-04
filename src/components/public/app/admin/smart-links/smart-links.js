var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.smart-links",{
			url: "/smart-links",
			templateUrl: "/templates/components/public/app/admin/smart-links/smart-links.html",
			controller: "SmartLinksController"
		})
});

app.controller( 'SmartLinksController', function( $scope, $rootScope, $state )
{
    if( !$rootScope.site || $rootScope.site.capabilities.indexOf( 'manage_content' ) == -1 )
        $state.go('public.app.site.home');
} );
