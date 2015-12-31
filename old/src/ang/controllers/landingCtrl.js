app.controller('LandingController', function ($scope, $rootScope, $state, $modal, Restangular) {
	$rootScope.is_landing = true;
	$rootScope.full_bleed = false;
	$rootScope.optin = false;
	$scope.data = []
	$scope.listing = [];
	$scope.top3Listing = [];
	$scope.currentPage = 1;
	$scope.disable = true;

	Restangular.all('directory').getList().then(function (listing) {
		$scope.data = listing;
		udpateListing($scope.data);
		$scope.disable = false;
	});
	
	function chunk(arr, size) {
  		var newArr = [];
	  	for (var i=0; i<arr.length; i+=size) {
	    	newArr.push(arr.slice(i, i+size));
	  	}
  		return newArr;
	}

	function udpateListing(data) {

		$scope.listing = chunk(data, 4);

		/*
		if (data.length > 3) {
			$scope.top3Listing = data.slice(0, 3);
			$scope.listing = chunk(data.slice(3), 4);
		} else {
			$scope.listing = [];
			$scope.top3Listing = data;
		}
		*/
	}

	 $scope.loadMore = function() {
	 	$scope.disable = true;
        console.log("Infinite scroll");

         Restangular.all('directory').getList({p:++$scope.currentPage}).then(function (listing) {
         	$scope.data.concat(listing);
         	console.log(listing);
         	udpateListing($scope.data);
         	if(listing.length>0)
                $scope.disable = false;
        });
    }
	
});