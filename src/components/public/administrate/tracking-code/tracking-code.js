var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.tracking-code",{
			url: "/tracking-code",
			templateUrl: "/templates/components/public/administrate/tracking-code/tracking-code.html",
			controller: "TrackingCodeController"
		})
}); 

app.controller("TrackingCodeController", function ($scope,$state, $localStorage,  Restangular, toastr) {
	$scope.showModal = function(){
	    $name = 'Member Stats Dashboard';
	    console.log($state.current.name);
	    if($state.current.name=='public.administrate.tracking-code')
	        $name = 'Tracking Code';
	    else if($state.current.name == 'public.administrate.affiliate-dashboard')
	        $name = 'Affiliate Dashboard'
	    $scope.message = 'The' +$name+' will arrive shortly, so hold tight!';
	    var modalInstance = $modal.open({
	        templateUrl: '/templates/modals/comingSoon.html',
	        controller: "modalController",
	        scope: $scope,
	    });
	}     
});