app.controller('AffiliateTeamsController', function ($scope, $localStorage, $site , $modal, Restangular) {
    $scope.template_data = {
        title: 'AFFILIATE_TEAMS',
        description: 'Group affiliates together into "teams" for displaying on leaderboards.',
        singular: 'affiliate team',
        edit_route: 'admin.team.jv.team',
        api_object: 'affiliateTeam'
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

app.controller('AffiliateTeamController', function ($scope, $localStorage, Restangular, toastr, $state, affiliates, affiliate_team) {
    $scope.affiliate_team =  affiliate_team;
    $scope.affiliates = affiliates.items;

    for (var i = 0; i < $scope.affiliates.length; i++) {
        $scope.affiliates[i]['affiliate_id'] = $scope.affiliates[i].id;
    };

    $scope.page_title = $scope.affiliate_team.id ? 'Edit Team' : 'Create Team';


    $scope.save = function(){
        if ($scope.affiliate_team.id){
            $scope.update();
            return;
        }
        $scope.create();
    }

    $scope.ifAlreadyExists = function(affiliate){
        var member = _.findWhere($scope.affiliate_team.members , {affiliate_id : affiliate.id});
        if(member){
            return true;
        }
        return false;
    }

    $scope.create = function(){
        $scope.affiliate_team.site_id=$scope.site.id;
        $scope.affiliate_team.company_id=$scope.site.company_id;
        Restangular.service("affiliateTeam").post($scope.affiliate_team).then(function(response){
            toastr.success("Team created!");
            
            $state.go("admin.team.jv.teams");
        });
    }

    $scope.update = function(){
        $members=[];
        console.log($scope.affiliate_team.members);
        if(($scope.affiliate_team.members.length>0)&&($scope.affiliate_team.members[0].id))
        {
            $members=$scope.affiliate_team.members.map(function(member){return member.affiliate_id.toString()});
            $scope.affiliate_team.members=$members;
        }
        
        $scope.affiliate_team.put().then(function(response){
            toastr.success("Team saved!");
           
            $state.go("admin.team.jv.teams");
        });
    }

});

