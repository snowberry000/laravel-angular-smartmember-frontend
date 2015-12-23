
app.controller('themeEngineController', function ($rootScope, $scope, smSidebar, $state , $localStorage, $location, $stateParams,  Restangular, toastr) {

    $scope.original_data = [];
    $rootScope.viewport = ''
    console.log( ' theme options: ', $scope.current_theme_options );

    $scope.toggleSidebar = function(option){
        if($rootScope.sidebar == option)
            return;
        $rootScope.sidebar = option;
    }

    $scope.toggleViewPort = function(option){
        if($rootScope.viewport == option)
            return;
        $rootScope.viewport = option;
    }

    $scope.close = function(){
        smSidebar.Close();
        $rootScope.viewport = '';
    }

    $scope.save = function(){
        angular.forEach($rootScope.meta_data, function(value , key){
            console.log(key)
            console.log(value)
            for (var i = $scope.original_data.length - 1; i >= 0; i--) {
                if($scope.original_data[i].slug == key)
                    $scope.original_data.splice(i , 1);
            };
            $scope.original_data = _.without($scope.original_data , {slug : key});
            console.log($scope.original_data)
        });
        Restangular.all('siteMetaData').customPOST($rootScope.meta_data, "save").then(function () {
            toastr.success("Options are saved!");
            $rootScope.viewport = '';
            smSidebar.Close();
            $rootScope.app.show_engine = false;
        });
    }

    $scope.$on('$destroy', function() {
        console.log($scope.original_data);

        $scope.destroyed = true;
        $state.transitionTo($state.current, $stateParams, { 
          reload: true, inherit: false, location: false
        });        
    });
});