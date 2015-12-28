app.controller('MenuItemModalInstanceCtrl', function ($scope,smModal,$stateParams, $rootScope, Restangular, toastr) {
    $site=$rootScope.site;
    var menu=$rootScope.menuType;
    var next_item=null;

    $scope.resolve = function () {
        if( $stateParams.id )
        {
            if(menu!='footer')
                next_item = _.find($site.menu_items, function(item){ return item.id == $stateParams.id; });
            else
                next_item = _.find($site.footer_menu_items, function(item){ return item.id == $stateParams.id; });
        }
    }

    $scope.resolve();
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
            smModal.Show('public.admin.site.appearance.menus');
        });
    };
});