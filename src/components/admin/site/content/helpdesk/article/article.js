var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.content.helpdesk.article",{
			url: "/article/:id?",
			templateUrl: "/templates/components/admin/site/content/helpdesk/article/article.html",
			controller: "ArticleController",
		    resolve: {
			    $article: function(Restangular,$rootScope, $site , $stateParams , $location) {
				    if($stateParams.id)
					    return Restangular.one('supportArticle' , $stateParams.id).get();
				    else if($location.search().clone){
					    return Restangular.one('supportArticle', $location.search().clone).get();
				    }
				    else
					    return {company_id : 0}
			    }
		    }
		})
}); 

app.controller("ArticleController", function ($scope,$rootScope, Upload, $location, $timeout , $user , $modal, $localStorage, $state, $article,$stateParams, $site, $filter, Restangular, toastr) {
	//$scope.page = $page;
    if(!$article.id)
    {
        $article.company_id=$rootScope.site.company_id;
    }

    var draft;
    var changed;
    if($location.search().clone){
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

    $scope.saveCategory = function($model)
    {
        $model.company_id=$rootScope.site.company_id;
        Restangular.all('supportCategory').post($model).then(function(response){
            $scope.categories.push(response);
            toastr.success("Support category added successfully!");
        });
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

    


    $scope.init = function(){
        if($stateParams.article_id){
            Restangular.one('supportArticle',$stateParams.article_id).get().then(function(response){
                $scope.article = response;
            })
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
            $scope.article.put();
            toastr.success("Support article edited successfully!");
            $state.go("admin.site.content.helpdesk.articles");
        }
        else{
            Restangular.all('supportArticle').post($scope.article).then(function(response){
                if(draft)
                    Restangular.one('draft' , draft.id).remove();
                toastr.success("Support article added successfully!");
                $state.go("admin.site.content.helpdesk.articles");
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
    if(false && !$stateParams.id && !$location.search().clone)
    Restangular.all('draft').customGET('', {site_id : $rootScope.site.id , user_id : $user.id , key : 'articles.content'}).then(function(response){
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
            $scope.article = value;
        } , 
        function () {
          Restangular.one('draft' , draft.id).remove().then(function(res)
            {
                draft=null;
            });
        })
    }

    var timeout = null;
    $scope.$watch('article' , function(article , oldArticle){
        if(typeof changed == "undefined")
            changed = false;
        else
            changed = true;
        if (article != oldArticle && changed && !$scope.article.id && !$location.search().clone) {
              if (timeout) {
                $timeout.cancel(timeout)
              }
              timeout = $timeout($scope.start, 3000);  // 1000 = 1 second
            }
    } , true)

    $scope.start = function(){
        var data = {site_id : $rootScope.site.id , user_id : $user.id , key : 'articles.content' , value : JSON.stringify($scope.article)}
        Restangular.all('draft').post(data).then(function(response){
            console.log(response);
            draft=response;
        })
    }

});