var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.pages.refund",{
			url: "/refund",
			templateUrl: "/templates/components/public/app/admin/pages/core/refund/refund.html",
			controller: "RefundController",
			resolve: {
				$refund: function( Restangular, $site )
				{
					return Restangular.all( 'specialPage' ).getList( { site_id: $site.id, type: 'Refund Page' } );
				}
			}
		})
}); 

app.controller("RefundController", function ($scope, $localStorage, smModal , $rootScope, $state, $stateParams,  $filter, Restangular, toastr, Upload) {
	$scope.refund = {};
    $site = $rootScope.site;
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
            $state.go('public.app.admin.pages.core.list');
        }
        else {
            Restangular.all('specialPage').post(ref).then(function (refund) {
                refund.isOpen = false;
                $scope.refund = refund;
                toastr.success("Refund Page has been saved!");
                $state.go('public.app.admin.pages.core.list');
            });
        }
    }

    $scope.selectUrl = function(item , selected_url , show_next){
    
      var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle' , 'bridgePage'];
      if(!selected_url)
          return;
      if(api_resources.indexOf(selected_url)<0)
      {
          $scope.refund.free_item_url = selected_url;
          item.url = selected_url;
          $scope.show_next=show_next;
          $scope.close();
      }
      else if(selected_url == 'download'){
        Restangular.all('').customGET('download',{site_id: item.site_id}).then(function(response){
            var downloads = response;
            downloads.forEach(function(entity){
                entity.url = entity.permalink;
            })
            $scope.show_next = true;
            $scope.loaded_items = {items : downloads };
              
        })
      }
      else
      {
        Restangular.all(selected_url).customGET('',{site_id: item.site_id}).then(function(response){
            if(response.route == 'customPage')
                response.route = 'page';
            if(response.route == 'supportArticle')
                response.route = 'support-article';
            response.items.forEach(function(entity){
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