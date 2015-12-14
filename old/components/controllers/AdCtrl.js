app.controller('adminSiteAdsController', function ($scope, $state,$http, $ads, $site, Restangular, toastr, $modal) {

    $scope.ads = $ads;

    $scope.currentPage = 1;

    $scope.loadMore = function(){
        $scope.disable = true;
        Restangular.all('siteAds').getList({p:++$scope.currentPage , site_id :$site.id}).then(function (ads) {
            $scope.ads = $scope.ads.concat(ads);
            if(ads.length>0)
                $scope.disable = false;
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
                 toastr.success("Ad removed!");
             });
         })
    }

    $scope.save = function(){
        $scope.postAds=[];
        console.log("check1");
        $.each($(".ad_items"), function (key, ad) {
            console.log("check2");
            $tempAd=$(ad).data("component");
            $tempAd.sort_order=key;
            $scope.postAds.push($tempAd);
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
            toastr.success("Banner saved!");
        });
    }


    $scope.dragControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope){
            return true;
        },
        itemMoved: function ($event) {console.log("moved"); },//Do what you want},
        orderChanged: function($event) {console.log("orderchange1"); setTimeout($scope.save,200);},//Do what you want},
        
        dragEnd: function ($event) {
            $(window).off();
        },
        containment: '#board'//optional param.
    };

});

app.controller('adminSiteWidgetsController', function ($scope, $state,$http, $ads, $site, Restangular, toastr, $modal) {

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

app.controller('adminSiteAdController', function ($scope,$state, $http, $ad, $site, Restangular, toastr,Upload) {
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
                $state.go('admin.site.appearance.banners');
            });
        }
        else {
            $scope.ad.site_id = $site.id;
            Restangular.all('siteAds').post($scope.ad).then(function(response){
                console.log(response);
                $scope.ad = response;
                toastr.success("Banner saved!");
                $state.go('admin.site.appearance.banners');
            });
        }
    }
});



app.controller('SiteAdsSummaryController', function ($scope, $ad) {
    $scope.ad = $ad[0];
    $scope.ads = $ad;
    $scope.views = 0;
    $scope.clicks = 0;

    /*var options = {
        segmentShowStroke : true,
        segmentStrokeColor : "#fff",
        segmentStrokeWidth : 2,
        percentageInnerCutout : 45, // This is 0 for Pie charts
        animationSteps : 100,
        animationEasing : "easeOutBounce",
        animateRotate : true,
        animateScale : false
    };*/

    var options = {
        series: {
            pie: {
                show: true,
                radius : 100
            }
        }
    }

    if ($ad)
    {
        $.each($scope.ads, function(key, value)
        {
            //$scope.charts.data[0].push( [value.views, value.clicks] );
            $scope.views += value.views;
            $scope.clicks += value.clicks;
        });
    }
    if ($ad[0]) {
         
        
        $scope.charts = {"data" : [{label :"views" , data : $scope.views} , {label :"clicks" , data : $scope.clicks}], "options" : options};

        $scope.labels = ["View", "Clicks"];
        $scope.ad.views = $scope.views;
        $scope.ad.clicks = $scope.clicks;
    } else {
        $scope.ad = {};
        $scope.ad.views = 0;
        $scope.ad.clicks = 0;
    }
    
});