app.controller('SyllabusSpecialPageCtrl',function($scope,$rootScope,$state,$site,Restangular,toastr){
    $scope.site = $site;

    $scope.save = function(){
        Restangular.one('site',$site.id)
            .put(
                {syllabus_format: $scope.site.syllabus_format,
                 show_syllabus_toggle: $scope.site.show_syllabus_toggle,
                 welcome_content: $scope.site.welcome_content
                }
                 )
            .then(function(response){
                $state.go("admin.site.pages.core.list");
                toastr.success("Your syllabus changes has been saved!");
            });
    }
});

app.controller('specialPagesController', function ($scope, $rootScope, $localStorage, $location, $site , $site_options , $stateParams, $modal, Restangular, toastr, $state) {
    
    $homepage_url=_.find($scope.site.meta_data, function(temp){ return temp.key == 'homepage_url'; });
    if($homepage_url)
        $scope.site_options = {homepage_url:$homepage_url.value};
    else
        $scope.site_options ={};
    
    $scope.site=$site;
    $.each($site_options, function (key, data) {
        $scope.site_options[data.key] = data.value;
    });
    $scope.site_options.isOpen = false;
    $rootScope.not_homepage_setting = false;

    //this looks like it doesn't belong here, but it actually is needed to make the icon picker work
    //the function name has to be updateMenuItem because it is what the icon picker directive looks for
    $scope.updateMenuItem = function ( model ) {
        console.log('chosen menu item is ' + model.custom_icon);
        $scope.site_options.cap_icon = model.custom_icon;
        jQuery('#cap_icon i').attr('class','').addClass('fa ' + $scope.site_options.cap_icon );
        $scope.site_options.open = false;
    }

    $scope.menuItemLabel=function(){
        $('.ui-iconpicker').toggleClass('open');
    }
    
    $scope.save = function () {
        delete $scope.site_options.url;
        delete $scope.site_options.open;
        Restangular.all('siteMetaData').customPOST($scope.site_options, "save").then(function () {
            toastr.success("Options are saved!");
            $scope.site_options.isOpen = false;
            $localStorage.homepage_url = $scope.site_options.homepage_url;
            $state.go('admin.site.pages.core.list');
        });
    }

    $scope.selectUrl = function(item , selected_url , show_next){

        var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle', 'bridgePage'];
        if(!selected_url)
            return;
        if(api_resources.indexOf(selected_url)<0)
        {
            item.url = selected_url;
            $scope.site_options['homepage_url'] = selected_url;
            $scope.show_next = show_next;
            $scope.site_options.isOpen = false;
        }
        else if(selected_url == 'download'){
            console.log(item.site_id)
            Restangular.all('download').customGET('',{site_id: $site.id}).then(function(response){
                var downloads = response;
                downloads.items.forEach(function(entity){
                    entity.url = entity.permalink;
                })
                $scope.show_next = true;
                $scope.loaded_items = downloads;

            })
        }
        else
        {
            Restangular.all(selected_url).customGET('',{site_id: $site.id}).then(function(response){
                if(response.route == 'customPage')
                    response.route = 'page';
                if(response.route == 'supportArticle')
                    response.route = 'support-article';
                response.items.forEach(function(entity){
                    entity.url = entity.permalink;
                })
                $scope.show_next = true;
                $scope.loaded_items = response;

            })
        }
    }

});

app.controller('loginPageSettingsController', function ($scope, $rootScope, $localStorage, $location, $site , $site_options , $stateParams, $modal, Restangular, toastr, $state) {

    $scope.site_options = {};

    $scope.site=$site;

    $.each($site_options, function (key, data) {
        $scope.site_options[data.key] = data.value;
    });

    $scope.site_options.isOpen = false;

    $scope.save = function () {
        delete $scope.site_options.url;
        delete $scope.site_options.open;
        Restangular.all('siteMetaData').customPOST($scope.site_options, "save").then(function () {
            toastr.success("Options are saved");
            $scope.site_options.isOpen = false;
            $localStorage.homepage_url = $scope.site_options.homepage_url;
            $state.go('admin.site.pages.core.list');
        });
    }

    $scope.selectUrl = function(item , selected_url , show_next){

        var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle', 'bridgePage'];
        if(!selected_url)
            return;
        if(api_resources.indexOf(selected_url)<0)
        {
            item.url = selected_url;
            $scope.site_options['create_account_url'] = selected_url;
            $scope.show_next = show_next;
            $scope.site_options.isOpen = false;
        }
        else if(selected_url == 'download'){
            console.log(item.site_id)
            Restangular.all('download').customGET('',{site_id: $site.id}).then(function(response){
                var downloads = response;
                downloads.items.forEach(function(entity){
                    entity.url = entity.permalink;
                })
                $scope.show_next = true;
                $scope.loaded_items = downloads;

            })
        }
        else
        {
            Restangular.all(selected_url).customGET('',{site_id: $site.id}).then(function(response){
                if(response.route == 'customPage')
                    response.route = 'page';
                if(response.route == 'supportArticle')
                    response.route = 'support-article';
                response.items.forEach(function(entity){
                    entity.url = entity.permalink;
                })
                $scope.show_next = true;
                $scope.loaded_items = response;

            })
        }
    }

});

app.controller('refundPageController', function ($scope, $localStorage, $site, $state, $stateParams, $modal, $filter, Restangular, toastr, Upload) {
    $scope.refund = {};
    $scope.loading=true;
    Restangular.all('specialPage').getList({site_id:$site.id , type:'Refund Page'}).then(function(response){
        $refund=response;
        $scope.loading=false;
        if($refund.length>0){
            $scope.refund = $refund[0];
            $scope.embed_content = $scope.refund.embed_content;
        }
        $scope.refund.isOpen = false;
        $scope.refund.type = 'Refund Page';
        $scope.refund.site_id = $site.id;
        $scope.isChecked = false; 
    });

    $scope.save = function () {
        delete $scope.refund.url;
        var ref = angular.copy($scope.refund);
        delete ref.isOpen;
        if (ref.id) {
            Restangular.all('specialPage').customPUT(ref , ref.id)
            toastr.success("Refund Page has been saved");
            $state.go('admin.site.pages.core.list');
        }
        else {
            Restangular.all('specialPage').post(ref).then(function (refund) {
                refund.isOpen = false;
                $scope.refund = refund;
                toastr.success("Refund Page has been saved!");
                $state.go('admin.site.pages.core.list');
            });
        }
    }

    $scope.selectUrl = function(item , selected_url , show_next){
    
      var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle'];
      if(!selected_url)
          return;
      if(api_resources.indexOf(selected_url)<0)
      {
          $scope.refund.free_item_url = selected_url;
          item.url = selected_url;

          $scope.refund.isOpen = false;
      }
      else if(selected_url == 'download'){
        Restangular.all('').customGET('download',{site_id: item.site_id}).then(function(response){
            var downloads = response.downloads;
            downloads.forEach(function(entity){
                entity.url = entity.permalink;
            })
            $scope.show_next = true;
            $scope.loaded_items = downloads;
              
        })
      }
      else
      {
        Restangular.all(selected_url).getList({site_id: item.site_id}).then(function(response){
            if(response.route == 'customPage')
                response.route = 'page';
            if(response.route == 'supportArticle')
                response.route = 'support-article';
            response.forEach(function(entity){
                entity.url =  entity.permalink;
            })
            $scope.show_next = true;
            $scope.loaded_items = response;
              
        })
      }
    }

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
});


app.controller('freeBonusController', function ($scope, $localStorage,$site, $state , $location , $anchorScroll, $stateParams, $modal, $filter, Restangular, toastr, Upload) {
    $scope.bonus = {};
    $scope.loading=true;

    Restangular.all('specialPage').getList({site_id:$site.id , type:'Free Bonus'}).then(function(response){
        $bonus=response;
        $scope.loading=false;
        if($bonus.length>0){
            $scope.bonus = $bonus[0];
            $scope.embed_content = $scope.bonus.embed_content;
        }
        $scope.bonus.type = 'Free Bonus';
        $scope.bonus.site_id = $site.id;
        $scope.bonus.isOpen = false;
        $scope.isChecked=false;
        $anchorScroll($location.hash());
    });
    

    $scope.getFileName=function($url)
    {
      $str = $url.split("/");
      return $str[$str.length-1];
    }

    $scope.save = function () {
        delete $scope.bonus.url;
        var bonus = angular.copy($scope.bonus);
        delete bonus.isOpen;

        if (bonus.id) {
            console.log(bonus)
            Restangular.all('specialPage').customPUT(bonus , bonus.id);
            toastr.success("Free Bonus Page has been saved");
            $state.go('admin.site.pages.core.list');
        }
        else {
            Restangular.all('specialPage').post(bonus).then(function (bonus) {
                $scope.bonus = bonus;
                toastr.success("Free Bonus Page has been saved");
                $state.go('admin.site.pages.core.list');
            });
        }
    }

    // $scope.init = function(){
    //     Restangular.all('specialPage').getList({site_id:$site.id , type:'Free Bonus'}).then(function (bonus) {
    //         if(bonus.length>0){
    //             $scope.bonus = bonus[0];
    //             $scope.embed_content = $scope.bonus.embed_content;
    //         }
    //         $scope.bonus.type = 'Free Bonus';
    //         $scope.bonus.site_id = $site.id;
    //     });
    // }


    $scope.setUrl = function(){

        if($scope.isChecked){
            $scope.bonus.free_item_url = '/free-bonus';
        }
        else
        {
            $scope.bonus.free_item_url = null;
        }
    }

    $scope.selectUrl = function(item , selected_url , show_next){
    
      var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle'];
      if(!selected_url)
          return;
      if(api_resources.indexOf(selected_url)<0)
      {
          $scope.bonus.free_item_url = selected_url;
          item.url = selected_url;
          $scope.bonus.isOpen = false;
      }
      else if(selected_url == 'download'){
        Restangular.all('').customGET('download',{site_id: item.site_id}).then(function(response){
            var downloads = response.downloads;
            downloads.forEach(function(entity){
                entity.url = entity.permalink;
            })
            $scope.show_next = true;
            $scope.loaded_items = downloads;
              
        })
      }
      else
      {
        Restangular.all(selected_url).getList({site_id: item.site_id}).then(function(response){
            if(response.route == 'customPage')
                response.route = 'page';
            if(response.route == 'supportArticle')
                response.route = 'support-article';
            response.forEach(function(entity){
                entity.url = entity.permalink;
            })
            $scope.show_next = true;
            $scope.loaded_items = response;
              
        })
      }
    }

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
});

app.controller('ThankyouPageController', function ($scope, $site, $access_levels) {
    $scope.site = $site;

    $scope.getQueryVariable = function(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    $.each($site.meta_data, function (key, data) {
        $scope.options[data.key] = data.value;
    });

    $scope.jvzoo_product_id = $scope.getQueryVariable('cproditem') || null;
    $scope.access_level_id = $scope.getQueryVariable('access_level_id') || null;
    $scope.access_level = null;

    angular.forEach( $access_levels, function (value, key){
        if( $scope.access_level_id != null && value.id == $scope.access_level_id )
            $scope.access_level = value;
        else if( $scope.jvzoo_product_id != null && value.product_id == $scope.jvzoo_product_id )
            $scope.access_level = value;
    });

    if( $scope.access_level != null ) {
        if (typeof fbq == 'function') {
            fbq('track', 'Purchase', {
                content_name: $scope.access_level.name || $site.name,
                content_category: $site.name,
                content_type: 'product',
                value: $scope.access_level.price || 0,
                currency: 'USD'
            });
        }

        if (typeof $scope.options.facebook_conversion_pixel != 'undefined') {
            window._fbq = window._fbq || [];
            window._fbq.push(['track', $scope.options.facebook_conversion_pixel, {'content_name': $scope.access_level.name || $site.name, 'value': $scope.access_level.price || 0, 'currency': 'USD'}]);
        }
    }
});
