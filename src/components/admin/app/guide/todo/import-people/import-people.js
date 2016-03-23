var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.import-people", {
			url: "/import-people",
			templateUrl: "/templates/components/admin/app/guide/todo/import-people/import-people.html",
			controller: "AdminAppGuideTodoImportPeopleController"
		} )
} );

app.controller( "AdminAppGuideTodoImportPeopleController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Import some initial data' );

} );