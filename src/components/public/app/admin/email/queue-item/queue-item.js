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
    Restangular.one('emailJob', $stateParams.id).get().then(function(response){
        $scope.email_job = response;
    });
});