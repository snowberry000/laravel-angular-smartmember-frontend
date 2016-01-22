var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.download-center",{
			url: "/download-center",
			templateUrl: "/templates/components/public/app/download-center/download-center.html",
			controller: "PublicDownloadCenterController"
		})
}); 

app.controller('PublicDownloadCenterController', function ($scope,$rootScope, $localStorage, $state, $stateParams,  Restangular, toastr, $filter, $window) {
    
    $rootScope.page_title = $rootScope.site.name+' - Download Center';
    $scope.loading=true;
    

    Restangular.all('').customGET('download?bypass_paging=1').then(function(response){
        $downloads= response ? response.items : [];
        $scope.loading=false;
        $scope.downloads = $downloads;
        if ($scope.downloads && $scope.downloads.length > 0)
        {
            angular.forEach($scope.downloads, function(value, key) {
                switch(value.access_level_type){
                    case 1:
                        value.access = 'Public';
                        break;
                    case 2:
                        value.access = 'Members';
                        break;
                    case 3:
                        value.access = 'Members';
                        break;
                    case 4:
                        value.access = 'Draft (private)';
                        break;
                }
            });
        }
        $scope.chunkedData = $scope.chunk($scope.downloads, 4);
        $scope.currentDownload = 1;
    });

    $scope.chunk = function(arr, size) {
        if (arr != undefined)
        {
            var newArr = [];
            for (var i=0; i<arr.length; i+=size) {
                newArr.push(arr.slice(i, i+size));
            }
            return newArr;
        } else {
            return [];
        }
    }

    
    $scope.loadMore = function(){
        $scope.disable = true;
        Restangular.all('').customGET('download',{p:++$scope.currentDownload}).then(function (downloads) {
            if(downloads.length>0){
                $scope.downloads = $scope.downloads.concat(downloads.items);
                $scope.disable = false;

                angular.forEach($scope.downloads, function(value, key) {
                    switch(value.access_level_type){
                        case 1:
                            value.access = 'Public';
                            break;
                        case 2:
                            value.access = 'Members';
                            break;
                        case 3:
                            value.access = 'Members';
                            break;
                        case 4:
                            value.access = 'Draft (private)';
                            break;
                    }
                });
            }
        });
    }

    $scope.updateStats = function(download){
        if (download.download_link)
        {
            Restangular.all('get').customGET('download/'+download.id).then(function(response){
                $window.location.href = download.download_link;
            });
        } else {
            Restangular.all('get').customGET('download/'+download.id).then(function(response){
                if( ( response.aws_key != undefined && response.aws_key != '' ) || ( response.my_url != undefined && response.my_url != '' ) ) {
                    location.href = $scope.app.apiUrl + '/utility/download?' + ( response.aws_key != undefined ? 'aws_key=' + response.aws_key : 'file=' + response.my_url );
                } else {
                    toastr.error("Something went wrong, your file cannot be downloaded at this time");
                }
            })
        }
    }
});