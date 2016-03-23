var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo", {
			url: "/todo",
			templateUrl: "/templates/components/admin/app/guide/todo/todo.html",
			controller: "AdminAppGuideTodoController"
		} )
} );

app.controller( "AdminAppGuideTodoController", function( $scope, $http, $state, Restangular, $rootScope )
{
	$scope.is_completed = false;
	$scope.todo_icon = 'info';
	$scope.todo_title = 'To do';

	$scope.url_segment = $state.current.name.substr( $state.current.name.lastIndexOf( '.' ) + 1 );

	$http.get( 'json/todos.json' ).success( function( response )
	{
		$scope.todos = response.data;

		$.each( $scope.todos, function( key, value )
		{
			if( _.findWhere( value.children, { slug: $scope.url_segment } ) )
				$scope.todo_parent = value;
		} );

	} );

	$scope.SetCompleted = function( next_value )
	{
		$scope.is_completed = next_value;
	};

	$scope.SetTodoIcon = function( next_value )
	{
		$scope.todo_icon = next_value;
	};

	$scope.SetTodoTitle = function( next_value )
	{
		$scope.todo_title = next_value;
	};

	$scope.SetCompletedText = function( next_value )
	{
		$scope.todo_completed_text = next_value;
	};

} );