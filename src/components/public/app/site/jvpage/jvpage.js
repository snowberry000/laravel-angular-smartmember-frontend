var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site.jvpage",{
			url: "/jvpage",
			templateUrl: "/templates/components/public/app/site/jvpage/jvpage.html",
			controller: "JvpageController"
		})
}); 

app.controller('JvpageController', function ($scope,$site, Restangular,$rootScope, $localStorage, $location, toastr, $state, Upload) {
    $scope.emailLists = {};
    $scope.jv = {};
    $scope.isChecked = false; 
    $scope.urlPopover = {isOpen : false};
    $scope.loading = true;

    $scope.init = function() {
        Restangular.all('affiliateJVPage').getList().then(function (jv) {
            $scope.loading = false;
            if(jv.length>0){
                $scope.jv = jv[0];
            } 
            else {
                $scope.jv.company_id = $site.company_id;  
                $scope.jv.title = "";
            }
            $rootScope.page_title = $scope.jv.title ? $rootScope.site.name+' - '+$scope.jv.title : $rootScope.site.name+ ' - JV page';
            $scope.jv.subscribe_button_text = $scope.jv.subscribe_button_text ? 
                                                    $scope.jv.subscribe_button_text : '';
        });

        Restangular.all('emailList').getList().then(function(response){
            console.log('here we goes');
        });
    }

    $scope.save = function () {
        delete $scope.jv.email_list;

        if ($scope.jv.id) {
            $scope.jv.put().then(function(response){
                toastr.success("JV Page has been saved!");
                $state.go('public.administrate.site.pages.core.list');
            })
        }
        else {
            Restangular.all('affiliateJVPage').post($scope.jv).then(function (jv) {
                $scope.jv = jv;
                toastr.success("JV Page has been saved!");
                $state.go('public.administrate.site.pages.core.list');
            });
        }
    }

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
                    if(type=='thankyou'){
                        editor.insertImage($scope.editable2, data.file_name);
                    }
                    else{
                        editor.insertImage($scope.editable, data.file_name);
                    }
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
        }
    }


    $scope.setUrl = function(){
        if($scope.isChecked){
            $scope.jv.show_thankyou_note = 1;
        }
        else
        {
            $scope.jv.show_thankyou_note = 0;
        }
    }

    $scope.selectUrl = function(item , selected_url , show_next) {
        var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle' , 'bridgePage'];
      
        if(!selected_url)
          return;

        if(api_resources.indexOf(selected_url)<0)
        {
          $scope.jv.redirect_url = selected_url;
          item.url = selected_url;
          $scope.close();
          $scope.urlPopover.isOpen = false;
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
                  
            });
        }
    }

    $scope.subscribe = function() {
        if ($scope.jv.email) {
            var params = {'subdomain' : $site.subdomain, 'list' : $scope.jv.email_list.name, 'email' : $scope.jv.email};
            Restangular.one('emailSubscriber/subscribe').customPOST(params).then(function(response) {
                if (!$scope.jv.show_thankyou_note) {
                    $location.path($scope.jv.redirect_url);
                } else {
                    $location.path('/jvthankyou');
                }
            })
        }
    }
});