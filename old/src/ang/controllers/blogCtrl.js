app.controller('BlogsController', function ($scope, $rootScope, $state, $modal, Restangular, $blogPosts) {
    window.scrollTo(0,0);

	$rootScope.is_landing = false;
	$rootScope.full_bleed = true;
    $scope.blogPosts = $blogPosts;
    $scope.currentPage = 1;

    $scope.loadMore = function(){
        $scope.disable = true;
        Restangular.all('getBlogPosts').getList({p:++$scope.currentPage}).then(function (blogPosts) {
            $scope.blogPosts = $scope.blogPosts.concat(blogPosts);
            if(blogPosts.length>0)
                $scope.disable = false;
        });
    }

    $scope.formatDate = function ($unformattedDate){
        return moment($unformattedDate).format("MMMM Do YYYY");
    }
});

app.controller('BlogController', function ($scope, $rootScope, $state, $modal, Restangular, $blogPost) {
    window.scrollTo(0,0);

    $scope.blogPost = $blogPost;

    $scope.formatDate = function ($unformattedDate){
        return moment($unformattedDate).format("MMMM Do YYYY");
    }
});