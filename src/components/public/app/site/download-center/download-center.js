var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site.download-center",{
			url: "/download-center",
			templateUrl: "/templates/components/public/app/site/download-center/download-center.html",
			controller: "PublicDownloadCenterController"
		})
}); 

app.controller('PublicDownloadCenterController', function ($scope,$rootScope, $localStorage, $state, $stateParams,  Restangular, toastr, $filter, $window) {
    
    $rootScope.page_title = $rootScope.site.name+' - Download Center';
    $scope.loading=true;
    $scope.site = $rootScope.site;

    Restangular.all('').customGET('download?bypass_paging=1').then(function(response){
        $downloads= response ? response.items : [];
        $scope.loading=false;
        $scope.downloads = $downloads;
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

    $scope.accessLabel = function( access_level_type, access_level_id ) {
        switch( parseInt( access_level_type ) )
        {
            case 1:
                return 'Public';
                break;
            case 2:
                if( !access_level_id )
                    return 'Members';

                var access_level = _.findWhere( $scope.access_levels, {id: parseInt( access_level_id ) } ) || _.findWhere( $scope.access_levels, {id: access_level_id + '' } );

                if( access_level )
                    return access_level.name;
                else
                    return 'Members';
                break;
            case 3:
                return 'Members';
                break;
            case 4:
                return 'Draft (admin-only)';
                break;
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
        if (download.access_level_type == 2)
        {
            var has_access = false
            if ($scope.site.current_access_levels != undefined)
            {
                for (var j = 0; j < $scope.site.current_access_levels.length; j++) {
                    if (parseInt($scope.site.current_access_levels[j]) == download.access_level_id) {
                        has_access = true;
                    }
                };
            }
            if (!has_access)
            {
                var access_level = _.findWhere( $scope.access_levels, {id: parseInt( download.access_level_id ) } ) || _.findWhere( $scope.access_levels, {id: download.access_level_id + '' } );
                if (access_level != undefined && access_level.information_url != '')
                    window.location.href = access_level.information_url;
            }
        }

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