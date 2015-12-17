var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.appearance.banner",{
			url: "/banner/:id?",
			templateUrl: "/templates/components/public/admin/site/appearance/banner/banner.html",
			controller: "BannerController",
			resolve: {
				$ad: function( Restangular, $stateParams, $site )
				{
					if( $stateParams.id )
					{
						return Restangular.one( 'siteAds', $stateParams.id ).get();
					}
					else
					{
						return {};
					}
				}
			}
		})
}); 

app.controller("BannerController", function ($scope,$state, $http, $ad, $site, Restangular, toastr,Upload) {
	$scope.ad = $ad;

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

	$scope.save = function(){
	    if($scope.ad.id) {
	        $scope.ad.put().then(function(res){
	            toastr.success("Banner saved!");
	            $state.go('public.admin.site.appearance.banners');
	        });
	    }
	    else {
	        $scope.ad.site_id = $site.id;
	        Restangular.all('siteAds').post($scope.ad).then(function(response){
	            console.log(response);
	            $scope.ad = response;
	            toastr.success("Banner saved!");
	            $state.go('public.admin.site.appearance.banners');
	        });
	    }
	}
});