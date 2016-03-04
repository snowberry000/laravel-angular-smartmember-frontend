var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.pages.freebie",{
			url: "/freebie",
			templateUrl: "/templates/components/public/app/admin/pages/core/freebie/freebie.html",
			controller: "FreebieController",
			resolve: {
				$bonus: function( Restangular, $site )
				{
					return Restangular.all( 'specialPage' ).getList( { site_id: $site.id, type: 'Free Bonus' } );
				}
			}
		})
}); 

app.controller("FreebieController", function ($scope, $localStorage,$rootScope, smModal , $state , $location , $anchorScroll, $stateParams,  $filter, Restangular, toastr, Upload) {
	$scope.bonus = {};
    $scope.loading=true;
    $site = $rootScope.site;
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
            $state.go('public.app.admin.pages.core.list');
        }
        else {
            Restangular.all('specialPage').post(bonus).then(function (bonus) {
                $scope.bonus = bonus;
                toastr.success("Free Bonus Page has been saved");
                $state.go('public.app.admin.pages.core.list');
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
    
      var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle' , 'bridgePage'];
      if(!selected_url)
          return;
      if(api_resources.indexOf(selected_url)<0)
      {
          $scope.bonus.free_item_url = selected_url;
          item.url = selected_url;
          $scope.show_next=show_next;
          $scope.close();
      }
       else if(selected_url == 'post'){
        Restangular.all(selected_url).customGET('',{site_id: $site.id,view: 'admin'}).then(function(response){
            var posts = response.items;
            response.items.forEach(function(entity){
                entity.url =  entity.permalink;
            })
            $scope.show_next = true;
            $scope.loaded_items = {items : posts };
              
        })
      }
      else
      {
            $params = {site_id: $site.id, bypass_paging: true};
                    if(selected_url == 'lesson')
                    {
                        $params.drafted = false;
                    }

                    Restangular.all(selected_url).customGET('',$params).then(function(response){
                        if(response.route == 'customPage')
                            response.route = 'page';
                        if(response.route == 'supportArticle')
                            response.route = 'support-article';
                        if(response && response.items)
                            $.each(response.items,function(key,value){
                                value.url =  value.permalink;
                            });
                        else if(response)
                            $.each(response,function(key,value){
                               value.url =  value.permalinwk;
                            });
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