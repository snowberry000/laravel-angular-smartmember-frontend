var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.tracking-code",{
			url: "/tracking-code",
			templateUrl: "/templates/components/admin/tracking-code/tracking-code.html",
			controller: "TrackingCodeController"
		})
}); 

app.controller("TrackingCodeController", function ($scope,$state, $localStorage, $modal, Restangular, toastr) {
	$scope.showModal = function(){
	    $name = 'Member Stats Dashboard';
	    console.log($state.current.name);
	    if($state.current.name=='admin.tracking-code')
	        $name = 'Tracking Code';
	    else if($state.current.name == 'admin.affiliate-dashboard')
	        $name = 'Affiliate Dashboard'
	    $scope.message = 'The' +$name+' will arrive shortly, so hold tight!';
	    var modalInstance = $modal.open({
	        templateUrl: '/templates/modals/comingSoon.html',
	        controller: "modalController",
	        scope: $scope,
	    });
	}     
});