var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide", {
			url: "/guide",
			redirecTo: "admin.app.guide.todos",
			templateUrl: "/templates/components/admin/app/guide/guide.html",
			controller: "AdminAppGuideController"
		} )
} );

app.controller( "AdminAppGuideController", function( $scope, smTutorial )
{

} );