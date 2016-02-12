app.controller('MenuItemModalInstanceCtrl', function ($scope,smModal,$stateParams,$state, $rootScope, Restangular, toastr) {
    $site=$rootScope.site;
    var menu=$rootScope.menuType;
    var next_item=null;
    $scope.updateIcon = function($icon){
        $scope.editing_item.icon=$icon;
        console.log($scope.next_item.icon);
    }

    $scope.resolve = function () {
        if( $stateParams.id )
        {
            if($state.current.name == 'public.app.admin.appearance.menu')
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

    $scope.promptRemoveMe = function(id )
    {
        //$event.preventDefault();
        swal( {
            title: "Are you sure?",
            text: "Do you really want to remove this?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, remove it!",
            closeOnConfirm: true
        }, function()
        {
            $scope.deleteResource( id );
        } );
    }

    $scope.deleteResource = function(id){
        // alert($state.current.name);
        if($state.current.name == 'public.app.admin.appearance.menu'){
            Restangular.one('siteMenuItem', id)
                .remove()
                .then(function(response){
                    $state.go('public.app.admin.appearance.menus',{reloadHome : true})
                });
        }
        else{
            Restangular.one('siteFooterMenuItem', id)
                .remove()
                .then(function(response){
                    $state.go('public.app.admin.appearance.menus',{reloadHome : true});
                });
        }
    }

    $scope.menuItemLabel=function(){
        $('.ui-iconpicker').toggleClass('open');
    }

    $scope.selectUrl = function(item , selected_url , show_next){

        var api_resources = ['module', 'lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle' , 'bridgePage', 'category'];
        if(!selected_url)
            return;
        if(api_resources.indexOf(selected_url)<0)
        {
            item.url = selected_url;

            $scope.show_next = show_next;
            item.isOpen = false;
        }
        else if(selected_url == 'post'){
            Restangular.all('').customGET('post',{site_id: item.site_id}).then(function(response){
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
            var params = {site_id: item.site_id};
            if(selected_url != 'post')
                params.bypass_paging = true;

            Restangular.all(selected_url).customGET('' , params).then(function(response){
                if(response.route == 'customPage')
                    response.route = 'page';
                if(response.route == 'supportArticle')
                    response.route = 'support-article';

                if( response.items ) {
                    response.items.forEach(function (entity) {
                        if (selected_url == 'module')
                            entity.url = 'module/' + entity.id;
                        else
                            entity.url = entity.permalink;
                    })

                    $scope.loaded_items = response.items;
                } else {
                    console.log( 'we have stuff: ', response );
                    response.forEach(function (entity) {
                        entity.url = entity.permalink;
                    })

                    $scope.loaded_items = response;
                }
                $scope.show_next = true;

            })
        }
    }

    $scope.ok = function () {
        delete $scope.editing_item.isOpen;
        delete $scope.editing_item.open;

        var menuType = "siteMenuItem";

        if( $state.current.name == 'public.app.admin.appearance.footerMenuItem' )
            menuType = "siteFooterMenuItem";
        Restangular.all(menuType).customPUT($scope.editing_item, $scope.editing_item.id).then(function () {
            toastr.success("Success! Menu Item saved!");

            angular.forEach( $scope.next_item, function(value,key){
                $scope.next_item[key] = $scope.editing_item[key];
            });
            if(typeof $scope.next_item['url'] == undefined || !$scope.next_item['url']){
                $scope.next_item['url'] = $scope.editing_item.url;
            }

            $state.go('public.app.admin.appearance.menus');
        });
    };
});