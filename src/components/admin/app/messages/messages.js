var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.messages", {
			url: "/messages",
			redirectTo: 'admin.app.messages.auto',
			templateUrl: "/templates/components/admin/app/messages/messages.html",
			controller: "MessagesController"
		} )
} );

app.controller( "MessagesController", function( $scope, Restangular, RestangularV3, $rootScope, $localStorage , $stateParams, $state, smMembers, $http,$timeout )
{	
	$rootScope.page_title = "Messages";
	$scope.loading = false;
	$scope.search_parameters = {};
	$scope.messages = [];
	$scope.company = {};

	RestangularV3.one('company' , $localStorage.user.company_id).get().then(function(response){
		$scope.company = response;
		$rootScope.company = response;
	})
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	$scope.$watch('pagination.current_page', _.debounce(function () { 
		$scope.paginate();
		}, 1000)
	);

	$scope.paginate = function() {
		
		$scope.loading = true;
		$scope.search_parameters.p = $scope.pagination.current_page;
		
		RestangularV3.all('').customGET('message',$scope.search_parameters ).then(function(response){
			$scope.loading = false;
			$scope.messages = response.items;
			$scope.pagination.total_count = response.total_count;
		});
	}
});