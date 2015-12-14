app.controller('adminDownloadsController', function ($scope, $localStorage, $downloads , $site, $state, $stateParams, $modal, Restangular, toastr, $filter) {

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

app.controller('adminDownloadController', function ($scope,Upload, $localStorage,$download, $user , $timeout , $location, $site, $state, $stateParams, $modal, Restangular, toastr, $filter) {
    
    var draft;
    var changed;
    if($location.search().clone){
        delete $download.id;
        delete $download.access;
        delete $download.author_id;
        delete $download.history_count;
        delete $download.user_count;
        delete $download.site;
    }



    $scope.download = $download;
    if ($scope.download.end_published_date)
        $scope.download.end_published_date = new Date(moment($scope.download.end_published_date).format('l'));
    else
        $scope.download.end_published_date = null;
    if ($scope.download.published_date)
    {
        $scope.download.published_date = new Date(moment($scope.download.published_date).format('l'));
    } else {
        $scope.download.published_date = new Date();
        $scope.download.published_date.setSeconds(0);
        $scope.download.published_date.setMilliseconds(0);
    }
    $scope.download.access_level_type = parseInt( $scope.download.access_level_type );
    $scope.download.access_level_id = parseInt( $scope.download.access_level_id );

    if( $scope.download.access_level_type == 3 )
        $scope.download.access_level_type = 2;

    $scope.download.media_item = $download.media_item || {};
    var seo = {};
    if ($download.seo_settings) {
        $.each($download.seo_settings, function (key, data) {
            seo[data.meta_key] = data.meta_value;

        });
    }
    $scope.download.dripfeed_settings = $download.dripfeed;
    $scope.download.seo_settings = seo;

    $scope.imageUpload = function(files){

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
                url: $scope.app.apiUrl + '/utility/upload',
                file: file
            })
                .success(function (data, status, headers, config) {
                    console.log(data.file_name);
                    var editor = $.summernote.eventHandler.getModule();
                    file_location = '/uploads/'+data.file_name;
                    editor.insertImage($scope.editable, data.file_name);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
        }
    }

    $scope.onBlurTitle = function ($event) {
        if (!$scope.download.permalink)
            $scope.download.permalink = $filter('urlify')($scope.download.title);
        $scope.download.seo_settings.fb_share_title = $scope.download.title;
    }
    $scope.onBlurSlug = function ($event) {
        if ($scope.download.permalink)
            $scope.download.permalink = $filter('urlify')($scope.download.permalink);
    }

    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };


    $scope.save = function () {
         if( $scope.download.permalink == '' )
             this.onBlurTitle(null);

         if( $scope.download.access_level_type == 2 && $scope.download.access_level_id == 0 )
             $scope.download.access_level_type = 3;

        if($scope.download.access_level_type!=2)
            $scope.download.access_level_id = 0;
        if ($scope.download.id) {
            //delete $scope.download.media_item;
            delete $scope.download.history_count;
            delete $scope.download.user_count;
            delete $scope.download.site;
            $scope.download.put();
            $state.go("admin.site.content.downloads");
            toastr.success("Download has been saved");
        }
        else {
            Restangular.all('download').post($scope.download).then(function (download) {
                if(draft)
                    Restangular.one('draft' , draft.id).remove();
                $scope.download = download;
                $state.go("admin.site.content.downloads");
                toastr.success("Download has been saved!");
            });
        }
        
    }
    //disabling for now because this isn't the draft feature we wanted
    if(false && !$stateParams.id && !$location.search().clone)
    Restangular.all('draft').customGET('', {site_id : $site.id , user_id : $user.id , key : 'downloads.content'}).then(function(response){
        if(response.length){
            draft = response[0]
            $scope.loadDraft()
        }
    })
    $scope.loadDraft = function(){
        var value = JSON.parse(draft.value);
        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/loadDraft.html',
            controller: "modalController",
            scope: $scope,

        });
        modalInstance.result.then(function () {
            $scope.download = value;
        } , 
        function () {
          Restangular.one('draft' , draft.id).remove().then(function(res)
            {
                draft=null;
            });
        })
    }

    var timeout = null;
    $scope.$watch('download' , function(download , oldDownload){
        if(typeof changed == "undefined")
            changed = false;
        else
            changed = true;
        if (download != oldDownload && changed && !$scope.download.id && !$location.search().clone) {
              if (timeout) {
                $timeout.cancel(timeout)
              }
              timeout = $timeout($scope.start, 3000);  // 1000 = 1 second
            }
    } , true)

    $scope.start = function(){
        var data = {site_id : $site.id , user_id : $user.id , key : 'downloads.content' , value : JSON.stringify($scope.download)}
        Restangular.all('draft').post(data).then(function(response){
            console.log(response);
            draft=response;
        })
    }

    $scope.downloadFile = function(media){
        location.href = $scope.app.apiUrl + '/utility/download?' + ( media.aws_key != undefined ? 'aws_key=' + media.aws_key : 'file=' + media.url );
    }
});

app.controller('downloadController', function ($scope, $rootScope ,$localStorage, $state, $stateParams, $modal, Restangular, toastr, $filter) {
    $download={};
    $scope.loading=true;
    Restangular.one('downloadByPermalink' , $stateParams.permalink).get().then(function(response){
        $download=response;
        $scope.loading=false;
        $scope.download = $download;
        $rootScope.page_title = $download.title || $rootScope.page_title;
    });

    $scope.updateStats = function(download){
        Restangular.all('get').customGET('download/'+download.id).then(function(response){
            if( ( response.aws_key != undefined && response.aws_key != '' ) || ( response.my_url != undefined && response.my_url != '' ) )
                location.href = $scope.app.apiUrl + '/utility/download?' + ( response.aws_key != undefined ? 'aws_key=' + response.aws_key : 'file=' + response.my_url );
            else{
                toastr.error("Something went wrong, your file cannot be downloaded at this time!");
            }
        })
    }
    
});

app.controller('downloadsController', function ($scope,$rootScope, $localStorage, $state, $stateParams, $modal, Restangular, toastr, $filter, $window) {
    
    $rootScope.page_title = 'Downloads';
    $scope.loading=true;
    

    Restangular.all('').customGET('download').then(function(response){
        $downloads=response;
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
                $scope.downloads = $scope.downloads.concat(downloads);
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
                if( ( response.aws_key != undefined && response.aws_key != '' ) || ( response.my_url != undefined && response.my_url != '' ) )
                    location.href = $scope.app.apiUrl + '/utility/download?' + ( response.aws_key != undefined ? 'aws_key=' + response.aws_key : 'file=' + response.my_url );
                else{
                    toastr.error("Something went wrong, your file cannot be downloaded at this time");
                }
            })
        }
    }
});