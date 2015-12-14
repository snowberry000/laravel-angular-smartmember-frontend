var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.content.downloads",{
			url: "/downloads",
			templateUrl: "/templates/components/admin/site/content/downloads/downloads.html",
			controller: "DownloadsController",
            resolve: {
                $downloads: function(Restangular, $site) {
                    return Restangular.all('').customGET('download');
                }
            }
		})
}); 

app.controller("DownloadsController", function ($scope, $localStorage, $downloads , $site, $state, $stateParams, $modal, Restangular, toastr, $filter) {
	console.log($downloads);
    $scope.downloads =$downloads;
    $scope.currentPage = 1;

    $scope.dragControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope){
            return true;
        },
        itemMoved: function ($event) {console.log("moved");},//Do what you want},
        orderChanged: function($event) {console.log("orderchange");},//Do what you want},
        
        dragEnd: function ($event) {
            $(window).off();
        },
        containment: '#board'//optional param.
    };

    $scope.save = function(){
        $scope.postDownloads=[];
        $.each($(".download_item"), function (key, email) {
            $tempDownload=$(email).data("component");
            $tempDownload.sort_order=key;
            $scope.postDownloads.push($tempDownload);
        });
        console.log($scope.postDownloads);
        $scope.update();
    }

    $scope.update=function()
    {
        Restangular.all("/download/putDownloads").post({"downloads":$scope.postDownloads}).then(function(response){
            $state.go("admin.site.content.downloads");
            toastr.success("Success! Changes saved");
        });
    }


    $scope.loadMore = function(){
        $scope.disable = true;
        Restangular.all('').customGET('download',{p:++$scope.currentPage}).then(function (downloads) {
            if(downloads.length>0){
                $scope.downloads = $scope.downloads.concat(downloads);
                $scope.disable = false;
            }
        });
    }

    $scope.delete = function (download) {
        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return download.id
                }
            }
        });
        modalInstance.result.then(function () {
            Restangular.one('download' , download.id).remove().then(function () {
                $scope.downloads = _.without($scope.downloads, download);
            });
        })
    };
});