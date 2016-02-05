var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.helpdesk.organizer",{
			url: "/organizer",
			templateUrl: "/templates/components/public/app/admin/helpdesk/organizer/organizer.html",
			controller: "OrganizerController"
		})
}); 

app.controller("OrganizerController", function ($scope,$rootScope,$localStorage, $state, $stateParams,$filter, Restangular, toastr) {
	var category = Restangular.all("supportCategory");
    var article = Restangular.all("supportArticle");
    var pageMetaData = Restangular.all("siteMetaData");
    $site=$rootScope.site;
    $scope.unassigned_articles = [];
    $scope.categories = [];
    $scope.options={};

    $scope.init = function(){
        var details = $site;
        console.log('details');
        console.log(details);
        if (details) {
            $.each(details.meta_data, function (key, data) {
                $scope.options[data.key] = data.value;
            });
        }
        Restangular.all('supportCategory').getList({company_id:$site.company_id}).then(function (response) {
            if (response) {
                $scope.categories = response;
                $scope.categories = $filter('orderBy')($scope.categories, 'sort_order');
                for(var i=0;i<$scope.categories.length;i++)
                {
                    $scope.categories[i].articles=$filter('orderBy')($scope.categories[i].articles, 'sort_order');
                }
                $scope.$broadcast('dataloaded');
            }
        });

        Restangular.all('').customGET("supportArticle?category_id=0&company_id="+$site.company_id).then(function (response) {
            console.log("supportArticle");
            console.log(response);
            if (response) {
                $scope.unassigned_articles = response.articles;
                $scope.unassigned_articles = $filter('orderBy')($scope.unassigned_articles, 'sort_order');
                $scope.$broadcast('dataloaded');
            }
        });

        // Restangular.all('supportArticle').get({company_id:$site.company_id , category_id:0}).then(function (response) {
        //     if (response) {
        //         $scope.unassigned_articles = response;
        //         $scope.unassigned_articles = $filter('orderBy')($scope.unassigned_articles, 'sort_order');
        //         $scope.$broadcast('dataloaded');
        //     }
        // });
    }

    $scope.deleteArticle = function (article_item , category) {

        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return article_item.id
                }
            }

        });
    
        modalInstance.result.then(function () {
            if(!article_item.id){
                if(category)
                    category.articles = _.without(category.articles , article_item);
                else
                    $scope.unassigned_articles = _.without($scope.unassigned_articles, article_item);
                return;
            }

            Restangular.one("supportArticle", article_item.id).remove().then(function () {
                if(category)
                    category.articles = _.without(category.articles , article_item);
                else
                    $scope.unassigned_articles = _.without($scope.unassigned_articles, article_item);
            });
        })
    };

    $scope.deleteCategory = function (category_id) {

        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return category_id
                }
            }

        });
        modalInstance.result.then(function () {
            var categoryWithId = _.find($scope.categories, function (category) {
                return category.id === category_id;
            });
            var articles = categoryWithId.articles;
            Restangular.one("supportCategory", categoryWithId.id).remove().then(function () {
                $scope.categories = _.without($scope.categories, categoryWithId);
                angular.forEach(articles , function(value , key){
                    $scope.unassigned_articles.push(value);
                })
            });
        })
    };

    $scope.updateCategory = function (category_item) {
        var mod = {'title': category_item.title};

        if( category_item.id ) {
            category.customPUT(mod, category_item.id).then(function () {
                toastr.success("Success! category saved");
            });
        }
        else {
            pageMetaData.customPOST({"default_support_category_title": $scope.options.default_support_category_title}, "saveSingleOption").then(function () {
                
                toastr.success("Success! Category saved");
            });
        }
    };

    $scope.addCategory = function (newItem) {
        category.post({company_id:$site.company_id}).then(function (response) {
            $scope.categories.push(response);
            $scope.$broadcast('dataloaded');
            toastr.success("Success! New category is added");
        });
    }

    $scope.addArticle = function (category_id) {
    
       var categoryWithId = _.find($scope.categories, function (category) {
            return category.id === category_id;
        });
        var newArticle = {'category_id': category_id , 'company_id':$site.company_id};
        if(!categoryWithId.articles)
           categoryWithId.articles = [];
        categoryWithId.articles.push({count :categoryWithId.articles.length , article : newArticle });  
        //toastr("Your article is added!");

    }

    $scope.addUnassignedArticle = function () {
        var newArticle = {'category_id': 0 , 'company_id':$site.company_id};
        $scope.unassigned_articles.push({count :  $scope.unassigned_articles.length , article : newArticle }); 
    }

    $scope.updateArticle = function (article_item , category) {
        var art = {'title': article_item.title, 'content': article_item.content , company_id: $site.company_id , id:article_item.id};
        
        if(article_item.id){
            article.customPUT(art, article_item.id).then(function () {
                toastr.success("Success! Article saved");
            });
        }
        else{

            if(category)
                art.category_id = category.id;

            article.customPOST(art).then(function (response) {
                toastr.success("Success! New Artucle is added");
                if(category)
                    category.articles[article_item.count] = response;
                else
                    $scope.unassigned_articles[article_item.count] = response;
                $scope.$broadcast('dataloaded');
            });
        }
    }
     $scope.saveSupport = function () {
        var categories = [];
        $.each($(".module_item"), function (key, category) {
            var articles = [];
            $.each($(category).find(".lesson_item"), function (key, article) {
                articles.push({
                    "category_id": $(category).data("id"), "article_id": $(article).data("id")
                });
            });

            categories.push({"category_id":$(category).data("id") , "articles":articles});

        });
        category.customPOST(categories, "creator").then(function (data) {
            toastr.success("Success! Support content saved!");

        });

    }


    $scope.dragControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope) {
            if(sourceItemHandleScope.itemScope.sortableScope.element[0].id!='12')
                return true;
            else
                return false;
            },
        itemMoved: function ($event) {console.log("moved"+$event.source.sortableScope);},//Do what you want},
        orderChanged: function($event) {console.log("orderchange"+$event);},//Do what you want},
        containment: '#board'//optional param.
    };

    $scope.dragModuleControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope){
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        },
        itemMoved: function ($event) {console.log("moved"+$event.source.sortableScope);},//Do what you want},
        orderChanged: function($event) {console.log("orderchange"+$event);},//Do what you want},
        containment: '#board'//optional param.
    };

    $scope.init();


});