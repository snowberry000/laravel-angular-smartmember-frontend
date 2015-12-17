var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.email.autoresponders",{
			url: "/autoresponders",
			templateUrl: "/templates/components/public/admin/team/email/autoresponders/autoresponders.html",
			controller: "AutorespondersController"
		})
}); 

app.controller("AutorespondersController", function ($scope,$filter, $localStorage, $modal, Restangular, notify) {
	
	$scope.template_data = {
	    title: 'AUTORESPONDERS',
	    description: 'Autoresponders let you queue up emails to send to subscribers day by day, week by week on a scheduled basis starting for each subscriber uniquely based on their subscribe date.',
	    singular: 'autoresponder',
	    edit_route: 'public.admin.team.email.autoresponder',
	    api_object: 'emailAutoResponder'
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