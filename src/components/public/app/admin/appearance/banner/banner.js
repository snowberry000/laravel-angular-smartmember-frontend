var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.appearance.banner",{
			url: "/banner/:id?",
			templateUrl: "/templates/components/public/app/admin/appearance/banner/banner.html",
			controller: "BannerController"
		})
}); 

app.controller("BannerController", function ($scope, $rootScope, $state, $http,$stateParams, Restangular, toastr,Upload, smModal) {
	
	$site=$rootScope.site;

	$scope.resolve = function () {
		if( $stateParams.id )
		{
			Restangular.one( 'siteAds', $stateParams.id ).get().then(function(response){
				$ad=response;
				$scope.ad = $ad;
			});
		}
		else
		{
			$ad={};
			$scope.ad = $ad;
		}
		
	}

	$scope.toggleNewTab = function(){
		$scope.ad.open_in_new_tab = !$scope.ad.open_in_new_tab;
	}
	$scope.save = function(){
	    if($scope.ad.id) {
	        $scope.ad.put().then(function(res){
	            toastr.success("Banner saved!");
                $state.go('public.app.admin.appearance.banners');
	        });
	    }
	    else {
	        $scope.ad.site_id = $site.id;

	        Restangular.all('siteAds').post($scope.ad).then(function(response){
	            console.log(response);
	            $scope.ad = response;
	            toastr.success("Banner saved!");
                $state.go('public.app.admin.appearance.banners');
	        });
	    }
	}

	$scope.resolve();
});