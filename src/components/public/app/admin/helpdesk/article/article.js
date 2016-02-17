var app = angular.module("app");

app.config(function ($stateProvider) {
    $stateProvider
        .state("public.app.admin.helpdesk.article", {
            url: "/article/:id?",
            templateUrl: "/templates/components/public/app/admin/helpdesk/article/article.html",
            controller: "ArticleController"
        })
});

app.controller("ArticleController", function ($scope, $rootScope, Upload, $location, $timeout, $localStorage, $state, smModal, $stateParams, $filter, Restangular, toastr) {
    //$scope.page = $page;
    $user = $rootScope.user;
    $site = $rootScope.site;
    $article = null;
    var draft;
    var changed;
    var timeout = null;

    $scope.resolve = function () {
        if ($stateParams.id) {
            Restangular.one('supportArticle', $stateParams.id).get().then(function (response) {
                $article = response;
                $scope.init();
            });
        }
        else if ($location.search().clone) {
            Restangular.one('supportArticle', $location.search().clone).get().then(function (response) {
                $article = response;
                $scope.init();
            });
        }
        else {
            $article = {company_id: 0, display: 'default', status: 'draft'};
            $scope.init();
        }
    }

    $scope.init = function () {
        if (!Modernizr.inputtypes.date) {
            // no native support for <input type="date"> :(
            // maybe build one yourself with Dojo or jQueryUI
            $('input[type="date"]').datepicker();
            $('input[type="date"]').datepicker("option", "dateFormat", 'yy-mm-dd');
        }


        if (!$article.id) {
            $article.company_id = $rootScope.site.company_id;
        }

        if ($location.search().clone) {
            delete $article.id;
            delete $article.access;
            delete $article.author_id;
        }

        $scope.article = $article;
        $scope.article.id ? $scope.page_title = 'Edit article' : $scope.page_title = 'Create article';

        $scope.available_articles = [];

        Restangular.all('supportArticle?bypass_paging=true&parent_id=0view=admin&site_id=' + $site.id ).customGET().then(function (response) {
            $scope.available_articles = response.items;

            angular.forEach( $scope.available_articles, function( value, key ) {
                $scope.addChildren( value, value );
            } );

            $scope.flattenArticlesCollection();

            angular.forEach( $scope.available_articles, function( value, key ) {
                if( $scope.isChild( $scope.article, value.id ) )
                    delete $scope.available_articles[ key ];
            } )
        });

        $scope.addChildren = function( main_article, article, tier ) {
            if( !tier )
                tier = 1;

            if( !main_article.children )
                main_article.children = [];

            if( article.articles )
            {
                angular.forEach( article.articles, function( value, key ) {
                    value.tier = '';

                    for( var i = 0; i < tier; i++ )
                        value.tier += '-';

                    main_article.children.push( value );

                    $scope.addChildren( main_article, value, tier + 1 );
                } );
            }
        }

        $scope.flattenArticlesCollection = function() {
            var new_array = [];

            angular.forEach( $scope.available_articles, function( value, key ) {
                new_array.push( value );

                if( value.children )
                {
                    angular.forEach( value.children, function( value2, key2 ) {
                        new_array.push( value2 );
                    } );
                }
            } );

            $scope.available_articles = new_array;
        }

        $scope.$watch('article', function (article, oldArticle) {
            if (typeof changed == "undefined")
                changed = false;
            else
                changed = true;
            if (article != oldArticle && changed && !$scope.article.id && !$location.search().clone) {
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout($scope.start, 3000);  // 1000 = 1 second
            }
        }, true);
    }

    $scope.isChild = function( article, id ) {
        var child = false;

        if( article.articles && article.articles.length > 0 ) {
            angular.forEach( article.articles, function( value, key ) {
                if( !child ) {
                    if ( parseInt( value.id ) == parseInt( id ) )
                        child = true;
                    else
                        child = $scope.isChild( value, id );
                }
            } )
        }

        return child;
    }

    $scope.saveAsDraft = function () {
        $scope.article.status = 'draft';

        $scope.save();
    }

    $scope.publish = function () {
        $scope.article.status = 'published';

        $scope.save();
    }

    $scope.save = function () {
        if ($scope.article.permalink == '')
            this.onBlurTitle(null);

        if ($scope.article.permalink == '' || $scope.article.permalink == undefined) {
            toastr.error("Article permalink can not be empty.");
            return;
        }

        if ($scope.article.id) {
            $scope.article.put().then(function (response) {
                toastr.success("Support article edited successfully!");
                $state.go("public.app.admin.helpdesk.articles");

            })
        }
        else {
            Restangular.all('supportArticle').post($scope.article).then(function (response) {
                if (draft)
                    Restangular.one('draft', draft.id).remove();
                toastr.success("Support article added successfully!");
                $state.go("public.app.admin.helpdesk.articles");

            })
        }
    }

    $scope.onBlurTitle = function ($event) {
        if (!$scope.article.permalink)
            $scope.article.permalink = $filter('urlify')($scope.article.title).toLowerCase();
    }
    $scope.onBlurSlug = function ($event) {
        if ($scope.article.permalink)
            $scope.article.permalink = $filter('urlify')($scope.article.permalink);
    }

    $scope.resolve()
});