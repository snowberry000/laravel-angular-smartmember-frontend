app.controller('salesPageController', function ($scope, $localStorage, $state , $location, $details, $site , $stateParams, $modal, Restangular, toastr, Upload) {
   
    $scope.sales_options = {};
        
    $.each($details, function (key, data) {
        if (data.key == 'sales_page_enabled'){
            $scope.sales_options[data.key] = parseInt(data.value);
        }else{
            $scope.sales_options[data.key] = data.value;
        }
        
    });

    $scope.saveSalesPage = function () {
        Restangular.all("siteMetaData").customPOST($scope.sales_options, "save").then(function () {
            toastr.success("Sales page saved!");
            $state.go('admin.site.pages.core.list');
        });
    };


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
                    if(type=='outro')
                        editor.insertImage($scope.editable2, data.file_name);
                    else
                        editor.insertImage($scope.editable, data.file_name);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
        }
    }
});

app.controller('MenuItemModalInstanceCtrl', function ($scope, $rootScope, $modalInstance, next_item, menu, Restangular, toastr, $modal) {
    $scope.next_item = next_item;
    
    $scope.editing_item = angular.copy( next_item );
    $scope.modelOpen=false;
    console.log('menu icon: ');
    console.log($scope.editing_item);
    $scope.menuItemLabel=function(){
        $('.ui-iconpicker').toggleClass('open');
    }

    $scope.selectUrl = function(item , selected_url , show_next){

        var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle'];
        if(!selected_url)
            return;
        if(api_resources.indexOf(selected_url)<0)
        {
            item.url = selected_url;

            $scope.show_next = show_next;
            item.isOpen = false;
        }
        else if(selected_url == 'download'){
            Restangular.all('').customGET('download',{site_id: item.site_id}).then(function(response){
                var downloads = response.items;
                downloads.forEach(function(entity){
                    entity.url = entity.permalink;
                })
                console.log(downloads)
                $scope.show_next = true;
                $scope.loaded_items = downloads;

            })
        }
        else{
            Restangular.all(selected_url).customGET('',{site_id: item.site_id}).then(function(response){
                if(response.route == 'customPage')
                    response.route = 'page';
                if(response.route == 'supportArticle')
                    response.route = 'support-article';
                response.items.forEach(function(entity){
                    entity.url = entity.permalink;
                })
                $scope.show_next = true;
                $scope.loaded_items = response.items;

            })
        }
    }

    $scope.ok = function () {
        delete $scope.editing_item.isOpen;
        delete $scope.editing_item.open;

        var menuType = "siteMenuItem";

        if( menu == 'footer' )
            menuType = "siteFooterMenuItem";

        Restangular.all(menuType).customPUT($scope.editing_item, $scope.editing_item.id).then(function () {
            toastr.success("Success! Menu Item saved!");

            angular.forEach( $scope.next_item, function(value,key){
                $scope.next_item[key] = $scope.editing_item[key];
            });
            if(typeof $scope.next_item['url'] == undefined || !$scope.next_item['url']){
                $scope.next_item['url'] = $scope.editing_item.url;
            }
            $modalInstance.close();
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


app.controller('menuNavigationController', function ($rootScope,$scope, $filter, $document , $localStorage, $location, $site, $menus , $stateParams, $modal, Restangular, toastr) {
    $scope.sales_option = {};

    $scope.open1 = function (next_item, menu) {
        var modalInstance = $modal.open({
            templateUrl: 'templates/admin/site/appearance/menu-item-modal.html',
            controller: 'MenuItemModalInstanceCtrl',
            resolve: {
                next_item: function(){
                    return next_item;
                },
                menu: function(){
                    return menu;
                }
            }
        });
    };

    $scope.open2 = function (next_item, menu) {
        var modalInstance = $modal.open({
            templateUrl: 'templates/admin/site/appearance/footer-menu-item-modal.html',
            controller: 'MenuItemModalInstanceCtrl',
            resolve: {
                next_item: function(){
                    return next_item;
                },
                menu: function(){
                    return menu;
                }
            }
        });
    };

    $scope.sortableOptions = {
        stop: function(e, ui) {
            $scope.saveSettings();
        }
    };

    $.each($menus.meta_data, function (key, data) {
        $scope.sales_option[data.key] = data.value;
    });

    angular.forEach($menus.menu_items, function(value, key) {
        value.isOpen = false;
    });

    angular.forEach($menus.footer_menu_items, function(value, key) {
        value.isOpen = false;
    });

    $scope.menu_items = $filter('orderBy')($menus.menu_items, 'sort_order');
    $scope.footer_menu_items = $filter('orderBy')($menus.footer_menu_items, 'sort_order');

    $scope.addMenuItem = function (newItem) {
        //$scope.newItem.url='';
        Restangular.all("siteMenuItem").customPOST($scope.newItem).then(function (response) {
            response.isOpen = false;
            $scope.newItem={};
            $scope.menu_items.unshift(response);
            toastr.success("Success! Menu Item added");
        });
    }

    $scope.addFooterMenuItem = function (newItem) {
        //$scope.newFooterItem.url='';
        Restangular.all("siteFooterMenuItem").customPOST($scope.newFooterItem).then(function (response) {
            response.isOpen = false;
            $scope.newFooterItem={};
            $scope.footer_menu_items.unshift(response);
            toastr.success("success! Footer Menu Item added");
        });
    }

    $scope.updateMenuItem = function (menu_item) {
        var menu_clone = angular.copy(menu_item)
        delete menu_clone.isOpen;
        delete menu_clone.open;
        Restangular.all("siteMenuItem").customPUT(menu_clone, menu_item.id).then(function () {
            toastr.success("Success! Menu Item saved!");
        });
    }

    $scope.updateFooterItem = function (footer_menu_item) {
        var footer_menu_clone = angular.copy(footer_menu_item);
        delete footer_menu_clone.isOpen;
        Restangular.all("siteFooterMenuItem").customPUT(footer_menu_clone, footer_menu_item.id).then(function () {
            toastr.success("Success! Footer Menu Item saved!");
        });
    }

    $scope.deleteMenuItem = function (menu) {
        Restangular.one("siteMenuItem", menu.id).remove().then(function () {
            toastr.success("Success!  Menu Item deleted!");
            $scope.menu_items = _.without($scope.menu_items, menu);
        });
    };

    $scope.deleteFooterMenuItem = function (footer_menu) {
        Restangular.one("siteFooterMenuItem", footer_menu.id).remove().then(function () {
            toastr.success("Success! Footer Menu Item deleted!");
            $scope.footer_menu_items = _.without($scope.footer_menu_items, footer_menu);
        });
    };

    $scope.saveSettings = function () {
        
        // Restangular.all("siteFooterMenuItem").customPUT(footer_menu_item, footer_menu_item.id).then(function () {
        // });
        $(".menu_item").each( function (key,value) {

            $postMenuItem = $(value).data("component");
            $postMenuItem.sort_order=key;
            delete $postMenuItem.isOpen;
            delete $postMenuItem.open;
            Restangular.all("siteMenuItem").customPUT($postMenuItem, $postMenuItem.id).then(function () {
            });
        });

        $(".footer_menu_item").each( function (key,value) {

            $postMenuItem = $(value).data("component");
            $postMenuItem.sort_order=key;
            delete $postMenuItem.isOpen;
            Restangular.all("siteFooterMenuItem").customPUT($postMenuItem, $postMenuItem.id).then(function () {
            });
        });

        Restangular.all("siteMetaData").customPOST($scope.sales_option, "save").then(function () {
            toastr.success("Settings are saved!");
        });
    }

     $scope.selectUrl = function(item , selected_url , show_next){
    
      var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle'];
      if(!selected_url)
          return;
      if(api_resources.indexOf(selected_url)<0)
      {
          item.url = selected_url;
          if(item.type == 'menu_item')
              $scope.updateMenuItem(item);
          else
              $scope.updateFooterItem(item);
          $scope.show_next = show_next;
          item.isOpen = false;
      }
      else if(selected_url == 'download'){
        Restangular.all('').customGET('download',{site_id: item.site_id}).then(function(response){
            var downloads = response;
            downloads.forEach(function(entity){
                entity.url = entity.permalink;
            })
            console.log(downloads)
            $scope.show_next = true;
            $scope.loaded_items = downloads;
              
        })
      }
      else{
        Restangular.all(selected_url).customGET('',{site_id: item.site_id}).then(function(response){
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

    $scope.dragControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope) {
            //console.log(sourceItemHandleScope.itemScope.sortableScope.$id+" "+destSortableScope.$id);
            return sourceItemHandleScope.itemScope.sortableScope.$id == destSortableScope.$id;
        },
        itemMoved: function ($event) {console.log("moved"+$event.source.sortableScope);},//Do what you want},
        orderChanged: function($event) {console.log("orderchange"+$event);},//Do what you want},
        containment: '#board'//optional param.
    };

    $scope.footerDragControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope) {
            //console.log(sourceItemHandleScope.itemScope.sortableScope.$id+" "+destSortableScope.$id);
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        },
        itemMoved: function ($event) {console.log("moved"+$event.source.sortableScope);},//Do what you want},
        orderChanged: function($event) {console.log("orderchange"+$event);},//Do what you want},
        containment: '#board'//optional param.
    };

});


app.controller('siteOptionsController', function ($scope, $rootScope, $localStorage, $location, $site , $site_options , $stateParams, $modal, Restangular, toastr) {
    $scope.site_options = {};
    $.each($site_options, function (key, data) {
       $scope.site_options[data.key] = data.value;
   });
    $scope.site_options.isOpen = false;
    $rootScope.not_homepage_setting = false;

    $scope.updateMenuItem = function ( model ) {
        $scope.site_options.cap_icon = model.custom_icon;
        $('#cap_icon i').attr('class','').addClass('fa ' + $scope.site_options.cap_icon );
        delete $scope.site_options.open;
    }

    $scope.save = function () {
        delete $scope.site_options.url;
        delete $scope.site_options.open;
        Restangular.all('siteMetaData').customPOST($scope.site_options, "save").then(function () {
            toastr.success("Options are saved!");
            $scope.site_options.isOpen = false;
            $localStorage.homepage_url = $scope.site_options.homepage_url;
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
        Restangular.all('').customGET('download',{site_id: $site.id}).then(function(response){
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
        Restangular.all(selected_url).getList({site_id: $site.id}).then(function(response){
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

});

app.controller('themeController', function ($scope, $localStorage, $location,$site ,$meta_data, $stateParams, $modal, Restangular, toastr) {
    $scope.colors = ["#ac725e" , "#d06b64" , "#f83a22" , "#fa573c" , "#ff7537" , "#ffad46" , "#42d692" , "#16a765" , "#7bd148" , "#b3dc6c" , 
                    "#fbe983" , "#fad165" , "#92e1c0" , "#9fe1e7" , "#9fc6e7" , "#4986e7" ];
    $scope.meta_data = {};
    
    $.each($meta_data, function (key, data) {
        $scope.meta_data[data.key] = data.value;
    });

    $scope.current_theme = _.findWhere( global_themes, {slug: $scope.meta_data['theme'] } ) || _.findWhere( global_themes, {slug: 'default' } );
    console.log( 'current theme: ', $scope.current_theme );
    $scope.current_theme_options = [];

    angular.forEach( $scope.current_theme.theme_options, function(value){
        var theme_option = false;
        if( typeof value == 'string' ) {
            theme_option = _.findWhere(global_theme_options, {slug: value});
            if( theme_option )
                $scope.current_theme_options.push( theme_option );
        } else if( typeof value == 'object' ) {
            if( typeof value.slug != 'undefined' )
                theme_option = _.findWhere(global_theme_options, {slug: value});

            theme_option = theme_option || {};

            angular.forEach( value, function(val,key){
                theme_option[key] = val;
            });

            if( theme_option )
                $scope.current_theme_options.push( theme_option );
        }
    });

    console.log( ' theme options: ', $scope.current_theme_options );
   
    $scope.save = function(){
        Restangular.all('siteMetaData').customPOST($scope.meta_data, "save").then(function () {
            toastr.success("Options are saved!");
        });
    }
});

