var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.jv.teams",{
			url: "/teams",
			templateUrl: "/templates/components/public/admin/team/jv/teams/teams.html",
			controller: "AffiliateTeamsController"
		})
}); 

app.controller("AffiliateTeamsController", function ($scope, $localStorage, $site , $modal, Restangular) {

	$scope.template_data = {
	    title: 'AFFILIATE_TEAMS',
	    description: 'Group affiliates together into "teams" for displaying on leaderboards.',
	    singular: 'affiliate team',
	    edit_route: 'public.admin.team.jv.team',
	    api_object: 'affiliateTeam'
	}

	$scope.data = [];
	$scope.pagination = {current_page: 1};
	$scope.pagination.total_count = 1;

	$scope.paginate = function(){

	    if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

	        $scope.loading = true;

	        var $params = {p: $scope.pagination.current_page};

	        if ($scope.query) {
	            $params.q = encodeURIComponent( $scope.query );
	        }

	        Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
	            $scope.loading = false;
	            $scope.pagination.total_count = data.total_count;
	            $scope.data[ $scope.pagination.current_page] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
	        });
	    }
	}

	$scope.paginate();

	$scope.search = function()
	{
	    $scope.loading = true;
	    $scope.data = [];
	    $scope.pagination = {current_page: 1};
	    var $params = { p : $scope.pagination.current_page};

	    if ($scope.query){
	        $params.q = encodeURIComponent( $scope.query );
	    }

	    Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
	        $scope.pagination.total_count = data.total_count;

	        $scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

	        $scope.loading = false;
	    } , function(error){
	        $scope.data = [];
	    })
	}

	$scope.delete = function (id) {

	    var modalInstance = $modal.open({
	        templateUrl: 'templates/modals/deleteConfirm.html',
	        controller: "modalController",
	        scope: $scope,
	        resolve: {
	            id: function () {
	                return id
	            }
	        }

	    });
	    modalInstance.result.then(function () {
	        var itemWithId = _.find($scope.data[ $scope.pagination.current_page ], function (next_item) {
	            return next_item.id === id;
	        });

	        itemWithId.remove().then(function () {
	            $scope.data[ $scope.pagination.current_page ] = _.without($scope.data[ $scope.pagination.current_page ], itemWithId);
	        });
	    })
	};
});