app.controller('AffiliateContestsController', function ($scope, $localStorage, $modal, $site ,Restangular) {
    $scope.template_data = {
        title: 'CONTESTS',
        description: 'Allow affiliates to compete with one another promoting your Product(s).',
        singular: 'contest',
        edit_route: 'admin.team.jv.contest',
        api_object: 'affiliateContest'
    }

    $scope.data = [];
    $scope.pagination = {current_page: 1};
    $scope.pagination.total_count = 1;

    $scope.paginate = function(){

        if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
                $scope.loading = false;
                $scope.pagination.total_count = data.total_count;
                $scope.data[ $scope.pagination.current_page] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
            });
        }
    }

    $scope.paginate();

    $scope.search = function()
    {
        $scope.loading = true;
        $scope.data = [];
        $scope.pagination = {current_page: 1};
        var $params = { p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
            $scope.pagination.total_count = data.total_count;

            $scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

            $scope.loading = false;
        } , function(error){
            $scope.data = [];
        })
    }

    $scope.delete = function (id) {

        var modalInstance = $modal.open({
            templateUrl: 'templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return id
                }
            }

        });
        modalInstance.result.then(function () {
            var itemWithId = _.find($scope.data[ $scope.pagination.current_page ], function (next_item) {
                return next_item.id === id;
            });

            itemWithId.remove().then(function () {
                $scope.data[ $scope.pagination.current_page ] = _.without($scope.data[ $scope.pagination.current_page ], itemWithId);
            });
        })
    };
});

app.controller('AffiliateContestController', function ($scope, $filter,Upload, $localStorage, Restangular, toastr, $state, contest) {
    $scope.contest = contest;

    if(!$scope.contest.type)
        $scope.contest.type="sales";

    console.log(contest);
    $scope.dateOptions = {
        changeYear: true,
        formatYear: 'yy',
        startingDay: 1
    }
    $scope.contest.id ? $scope.page_title = 'Edit contest' : $scope.page_title = 'Create contest';

    $scope.format = 'MM/dd/yy';
    $scope.minDate = new Date();
    $scope.contest.start_date=new Date(moment.utc(contest.start_date));
    $scope.contest.end_date=new Date(moment.utc(contest.end_date));
    $scope.status = {
        opened: [false, false]
    };

    
    $scope.imageUpload = function(files){

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
                url: $scope.app.apiUrl + '/utility/upload',
                file: file
            })
                .success(function (data, status, headers, config) {
                    var editor = $.summernote.eventHandler.getModule();
                    file_location = '/uploads/'+data.file_name;
                    editor.insertImage($scope.editable, data.file_name);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
        }
    };

    $scope.selectAll = function()
    {

        if ($scope.isChecked) {
            contest.sites = $sites.admin.sites;
        }
        else
            contest.sites = [];
    }
    
    $scope.isAlreadythere=function($subdomain)
    {

        if ($scope.isChecked) return true;

        for(var i=0;i<contest.sites.length;i++)
        {
            if(contest.sites[i].subdomain==$subdomain)
                return true;
        }
        return false;
    }
    $scope.open = function(event, id) {
        $scope.status.opened[id] = true;
    }

    Restangular.all('site').customGET('members').then(function(response) {
        $sites = response;
        $scope.sites = response.admin;
    });

    $scope.save = function(){

        if($scope.contest.sites){
            for(var i=0;i<$scope.contest.sites.length;i++){
                if($scope.contest.sites[i].id)
                {
                    $scope.contest.sites[i]=$scope.contest.sites[i].id.toString();
                }
            }
        }
        if ($scope.contest.id){
            
            $scope.update();
            return;
        }
        $scope.create();
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
                    console.log("uploaded");
                    var editor = $.summernote.eventHandler.getModule();
                    file_location = '/uploads/'+data.file_name;
                    editor.insertImage($scope.editable, data.file_name);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
        }
    }

    $scope.update = function(){
        $scope.contest.put().then(function(response){
            toastr.success("Changes saved!");
            $state.go("admin.team.jv.contests");
        });
    }

    $scope.setPermalink = function ($title) {
        if (!$scope.contest.permalink)
        {
            $scope.contest.permalink ="leaderboard-" + $filter('urlify')($title);
        }
        
    }


    $scope.create = function(){
        Restangular.service("affiliateContest").post($scope.contest).then(function(response){
            toastr.success("Changes saved!");
            $state.go("admin.team.jv.contests");
        });
    }
});


app.controller('AffiliateLeaderboardController', function ($scope, $localStorage, Restangular, toastr, $state, leaderboard) {
    $scope.leaderboard = leaderboard;


});

