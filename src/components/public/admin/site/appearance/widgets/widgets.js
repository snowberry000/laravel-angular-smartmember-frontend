var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.appearance.widgets",{
			url: "/widgets",
			templateUrl: "/templates/components/public/admin/site/appearance/widgets/widgets.html",
			controller: "WidgetsController",
            resolve: {
                $ads: function( Restangular, $site )
                {
                    return Restangular.all( 'siteAds' ).getList( { site_id: $site.id } );
                },
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ui.sortable'
                        }
                    ]);
                }
			}
		})
}); 

app.controller("WidgetsController", function ($scope, $state,$http, $ads, $site, Restangular, toastr, $modal) {
	$scope.displayAds=[];
	$scope.hiddenAds=[];

	$scope.divide=function($allAds){
	    $.each($allAds,function(key,value){
	        if(value.display)
	        {
	            $scope.displayAds.push(value);
	        }
	        else
	        {
	            $scope.hiddenAds.push(value);
	        }
	    });
	}
	$scope.divide($ads);

	console.log("display ads: ");
	console.log($scope.displayAds);
	console.log("hidden ads: ");
	console.log($scope.hiddenAds);

	$scope.currentPage = 1;

	$scope.loadMore = function(){
	    $scope.disable = true;
	    Restangular.all('siteAds').getList({p:++$scope.currentPage , site_id :$site.id}).then(function (ads) {
	        $scope.ads = $scope.ads.concat(ads);
	        if(ads.length>0)
	            $scope.disable = false;
	        $scope.divide(ads);
	    });
	}
	$scope.$watch('displayAds|json', function() {
	    setTimeout($scope.save, 1000);
	});
	$scope.$watch('hiddenAds|json', function() {
	    setTimeout($scope.save, 1000);
	});

	$scope.save = function(){
	    $scope.postAds=[];
	    $.each($scope.displayAds,function(key,value){
	        value.display=true;
	        value.sort_order=key;
	        $scope.postAds.push(value);
	    });
	    $.each($scope.hiddenAds,function(key,value){
	        value.display=false;
	        value.sort_order=key;
	        $scope.postAds.push(value);
	    });

	    console.log($scope.postAds);
	    $scope.update();
	}

	$scope.sortableOptions = {
	    connectWith: ".connectList"
	};

	$scope.update=function()
	{
	    Restangular.all("putAdvertisementsOrder").post({"adds":$scope.postAds}).then(function(response){
	    });
	}

	$scope.delete= function($ad)
	{
	     var modalInstance = $modal.open({
	         templateUrl: '/templates/modals/deleteConfirm.html',
	         controller: "modalController",
	         scope: $scope,
	         resolve: {
	             id: function () {
	                 return $ad.id
	             }
	         }
	     });
	     modalInstance.result.then(function () {
	         $ad.remove().then(function(response){
	             for(var i=0;i<$scope.ads.length;i++) {
	                 if($scope.ads[i].id==$ad.id) {
	                     $scope.ads.splice(i, 1);
	                     break;
	                 }
	             }
	             toastr.success("Notification removed!");
	         });
	     })
	}

	$scope.dragControlListeners = {
	    accept: function (sourceItemHandleScope, destSortableScope){
	        return true;
	    },
	    itemMoved: function ($event) {console.log("moved");},//Do what you want},
	    orderChanged: function($event) {console.log("orderchange2"); setTimeout(200,$scope.save)},//Do what you want},

	    dragEnd: function ($event) {
	        $(window).off();
	    },
	    containment: '#board'//optional param.
	};
});