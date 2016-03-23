var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todos", {
			url: "/todos",
			templateUrl: "/templates/components/admin/app/guide/todos/todos.html",
			controller: "AdminAppGuideTodosController"
		} )
} );

app.controller( "AdminAppGuideTodosController", function( $scope, $http, RestangularV3, Restangular, $rootScope )
{
	$http.get( 'json/todos.json' ).success( function( response )
	{
		$scope.todos = response.data;
	} );

} );