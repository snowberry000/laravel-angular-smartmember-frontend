var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.email.queue-item",{
			url: "/queue-item/:id",
			templateUrl: "/templates/components/public/app/admin/email/queue-item/queue-item.html",
			controller: "smartMailQueueItemController"
		})
});

app.controller('smartMailQueueItemController', function ($scope,toastr, $q, $timeout, $localStorage, Restangular, $state, $stateParams, smModal ) {
    $scope.loading = true;

    Restangular.one('emailJob', $stateParams.id).get().then(function(response){
        $scope.email_job = response;
        $scope.loading = false;
    });

    $scope.numberWithCommas = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    $scope.uniqueOpenPercentage = function( segment ) {
        if( !parseInt( segment.unique_opens ) )
            return '0%';
        else
        {
            var percentage = ( segment.unique_opens / segment.total_recipients ) * 100;

            percentage = Math.round( percentage, 2 );

            return $scope.numberWithCommas( percentage ) + '%';
        }
    }

    $scope.uniqueClickPercentage = function( segment ) {
        if( !parseInt( segment.unique_clicks ) )
            return '0%';
        else
        {
            var percentage = ( segment.unique_clicks / segment.total_recipients ) * 100;

            percentage = Math.round( percentage, 2 );

            return $scope.numberWithCommas( percentage ) + '%';
        }
    }
});