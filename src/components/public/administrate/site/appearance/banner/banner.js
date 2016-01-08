var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.site.appearance.banner",{
			url: "/banner/:id?",
			templateUrl: "/templates/components/public/administrate/site/appearance/banner/banner.html",
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

	$scope.imageUpload = function(files , type){

	      for (var i = 0; i < files.length; i++) {
	        var file = files[i];
	        Upload.upload({
	            url: $scope.app.apiUrl + '/utility/upload',
	            file: file
	        })

	        .success(function (data, status, headers, config) {
	            var editor = $.summernote.eventHandler.getModule();
	            file_location = '/uploads/'+data.file_name;
	            if(type=='transcript')
	                editor.insertImage($scope.editable2, data.file_name);
	            else
	                $scope.ad.custom_ad = $scope.ad.custom_ad + '<img src=\''+data.file_name+'\'>';//editor.insertImage($scope.editable, data.file_name);//had to revert to this method because the other one wasn't working
	      }).error(function (data, status, headers, config) {
	      });
	    }
	}
	$scope.toggleNewTab = function(){
		$scope.ad.open_in_new_tab = !$scope.ad.open_in_new_tab;
	}
	$scope.save = function(){
	    if($scope.ad.id) {
	        $scope.ad.put().then(function(res){
	            toastr.success("Banner saved!");
                smModal.Show('public.administrate.site.appearance.banners');
	        });
	    }
	    else {
	        $scope.ad.site_id = $site.id;

	        Restangular.all('siteAds').post($scope.ad).then(function(response){
	            //console.log(response);
	            $scope.ad = response;
	            toastr.success("Banner saved!");
                smModal.Show('public.administrate.site.appearance.banners');
	        });
	    }
	}

	$scope.resolve();
});