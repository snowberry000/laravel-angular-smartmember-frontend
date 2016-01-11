var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.listing",{
			url: "/listing/:id?",
			templateUrl: "/templates/components/public/administrate/listing/listing.html",
			controller: "ListingController"
		})
}); 

app.controller("ListingController", function ($scope,smModal,$stateParams,Upload,$rootScope, $localStorage , $timeout , $location, $state,  Restangular, toastr, $filter) {

	$scope.listing = {};	
	if ($stateParams.id){
		Restangular.one('directory',$stateParams.id)
			.get()
			.then(function(response){
				$scope.listing = response;
			})
	}

	$scope.save = function(){
		$scope.listing.save().then(function(response){
			smModal.Show('public.administrate.listings');
		});
	}

});