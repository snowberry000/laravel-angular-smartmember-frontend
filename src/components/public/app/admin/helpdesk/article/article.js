var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.helpdesk.article",{
			url: "/article/:id?",
			templateUrl: "/templates/components/public/app/admin/helpdesk/article/article.html",
			controller: "ArticleController"
		})
}); 

app.controller("ArticleController", function ($scope,$rootScope, Upload, $location, $timeout  ,  $localStorage, $state, smModal,$stateParams, $filter, Restangular, toastr) {
	//$scope.page = $page;
    $user=$rootScope.user;
    $site=$rootScope.site;
    $article=null;
    var draft;
    var changed;
    var timeout = null;

    $scope.resolve =function(){
        if($stateParams.id)
        {
            Restangular.one('supportArticle' , $stateParams.id).get().then(function(response){
                $article = response;
                $scope.init();
            });
        }
        else if($location.search().clone){
            Restangular.one('supportArticle', $location.search().clone).get().then(function(response){
                $article = response;
                $scope.init();
            });
        }
        else
        {
            $article = {company_id : 0};
            $scope.init();
        }
    }

    $scope.init=function(){
        if (!Modernizr.inputtypes.date) {
          // no native support for <input type="date"> :(
          // maybe build one yourself with Dojo or jQueryUI
          $('input[type="date"]').datepicker();
          $('input[type="date"]' ).datepicker( "option", "dateFormat", 'yy-mm-dd' );
        }


        if(!$article.id)
        {
            $article.company_id=$rootScope.site.company_id;
        }
        if($stateParams.clone){
            delete $article.id;
            delete $article.access;
            delete $article.author_id;
        }
        $scope.article = $article;
        $scope.article.id ? $scope.page_title = 'Edit article' : $scope.page_title = 'Create article';
        $scope.categories = [];
        Restangular.all('supportCategory').getList({public_list:true,category_list:true}).then(function(response){
            $scope.categories = response;
        });

        if(false && !$stateParams.id && !$stateParams.clone)
        Restangular.all('draft').customGET('', {site_id : $rootScope.site.id , user_id : $user.id , key : 'articles.content'}).then(function(response){
            if(response.length){
                draft = response[0]
                $scope.loadDraft()
            }
        });
        $scope.$watch('article' , function(article , oldArticle){
            if(typeof changed == "undefined")
                changed = false;
            else
                changed = true;
            if (article != oldArticle && changed && !$scope.article.id && !$stateParams.clone) {
                  if (timeout) {
                    $timeout.cancel(timeout)
                  }
                  timeout = $timeout($scope.start, 3000);  // 1000 = 1 second
                }
        } , true);
    }
    
    $scope.openCategoryModel = function () {
        var modalInstance = $modal.open({
            size: 'lg',
            templateUrl: 'templates/modals/create_category.html',
            controller: "modalController",
            scope: $scope
        });

        modalInstance.result.then(function(){

        })
    };

    $scope.saveCategory = function($name)
    {
        
        if($name == undefined){
            toastr.error("Category cannot be empty!");
            return;
        }
        
        $cat = {title: $name, company_id:$rootScope.site.company_id, site_id:$rootScope.site.id }
        Restangular.all('supportCategory').post($cat).then(function(response){
            $scope.categories.push(response);
            toastr.success("Support category added successfully!");
            delete $scope.article.createCategory;
            $state.transitionTo($state.current, $state.params, { 
          reload: true, inherit: false, location: false
        });
        });
    }

    $scope.canceCategoryCreation = function()
    {
        delete $scope.article.createCategory;   
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

    $scope.save = function(){
        if( $scope.article.permalink == '' )
            this.onBlurTitle(null);

        if ($scope.article.permalink == '' || $scope.article.permalink == undefined)
        {   
            toastr.error("Article permalink can not be empty.");
            return;
        }

        if($scope.article.id){
            $scope.article.put().then(function(response){
                toastr.success("Support article edited successfully!");
                $state.go("public.app.admin.helpdesk.articles");
               
            })
        }
        else{
            Restangular.all('supportArticle').post($scope.article).then(function(response){
                if(draft)
                    Restangular.one('draft' , draft.id).remove();
                toastr.success("Support article added successfully!");
                $state.go("public.app.admin.helpdesk.articles");
                
            })
        }
    }

    $scope.onBlurTitle = function ($event) {
        if (!$scope.article.permalink)
            $scope.article.permalink = $filter('urlify')($scope.article.title);
    }
    $scope.onBlurSlug = function ($event) {
        if ($scope.article.permalink)
            $scope.article.permalink = $filter('urlify')($scope.article.permalink);
    }
    //disabling for now because this isn't the draft feature we wanted
    
    $scope.loadDraft = function(){
        var value = JSON.parse(draft.value);
        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/loadDraft.html',
            controller: "modalController",
            scope: $scope,

        });
        modalInstance.result.then(function () {
            $scope.article = value;
        } , 
        function () {
          Restangular.one('draft' , draft.id).remove().then(function(res)
            {
                draft=null;
            });
        })
    }

    $scope.start = function(){
        var data = {site_id : $rootScope.site.id , user_id : $user.id , key : 'articles.content' , value : JSON.stringify($scope.article)}
        Restangular.all('draft').post(data).then(function(response){
            console.log(response);
            draft=response;
        })
    }
    $scope.resolve()
});