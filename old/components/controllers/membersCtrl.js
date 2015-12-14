app.controller('MembersController', function ($scope, $user, $localStorage,$site , $location, $stateParams, $modal, Restangular, toastr, $state) {
    $scope.user = _.findWhere($user.role , {site_id : $site.id})

    $scope.template_data = {
        title: 'MEMBERS',
        description: 'Members are users who have registered on your site, purchased a product, or been imported.',
        singular: 'member',
        edit_route: '',
        api_object: 'role'
    }

    $scope.data = [];
    $scope.pagination = {current_page: 1};
    $scope.pagination.total_count = 1;

    $scope.paginate = function(){

        if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page, site_id: $site.id};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            if ($scope.access_level){
                $params.access_level = $scope.access_level;

                if ($scope.access_level_status) {
                    $params.access_level_status = $scope.access_level_status;
                }
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) + ( $scope.access_level ? '&access_level=' + $scope.access_level : '' ) + ( $scope.access_level_status ? '&access_level_status=' + $scope.access_level_status : '' ) ).then(function (data) {
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
        var $params = { site_id :$site.id , p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        if ($scope.access_level){
            $params.access_level = $scope.access_level;

            if ($scope.access_level_status) {
                $params.access_level_status = $scope.access_level_status;
            }
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) + ( $scope.access_level ? '&access_level=' + $scope.access_level : '' ) + ( $scope.access_level_status ? '&access_level_status=' + $scope.access_level_status : '' ) ).then(function(data){
            $scope.pagination.total_count = data.total_count;

            $scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

            $scope.loading = false;
        } , function(error){
            $scope.data = [];
        })
    }



    $scope.accessLevelList = function(next_item){
        var access_level_list = [];
        if( typeof next_item.access_level != 'undefined' ) {
            angular.forEach(next_item.access_level, function (value2, key2) {
                if (typeof value2.name != 'undefined' && value2.name != '')
                    access_level_list.push(value2.name);
            });
        }

        return access_level_list.join(', ');
    }

    $scope.getCSV = function() {
        Restangular.all('').customGET('role/getCSV', {site_id :$site.id}).then();
    }

    $scope.toggleAccess = function(member) {
        if( typeof member.type != 'undefined' ) {
            var p_owner = _.findWhere(member.type, {role_type: 1});
            var owner = _.findWhere(member.type, {role_type: 2});
            var manager = _.findWhere(member.type, {role_type: 3});

            if (p_owner || owner || manager) return;

            var role = _.filter(member.type, function (type) {
                return type.role_type == 2 || type.role_type == 3 || type.role_type == 4 || type.role_type == 6;
            })

            if (role[0].role_type == 4)
                role[0].role_type = 6;
            else if (role[0].role_type == 6)
                role[0].role_type = 4;

            if( role[0].role_type < 6 ) {
                if( !member.isTeamMember )
                    $scope.addToTeam( member );
            }

            Restangular.all('userRole').customPUT({role_type: role[0].role_type}, role[0].id).then(function (response) {
                members.getList({id: member.id}).then(function (response) {
                    if (response.length < 1) return;

                    for (var i = 0; i < $scope.members.length; i++) {
                        if ($scope.data[ $scope.pagination.current_page ][i].id == response[0].id) {
                            $scope.data[ $scope.pagination.current_page ][i] = response[0];
                        }
                    };
                });
            });
        }
    }

    $scope.addToTeam = function(member){
        Restangular.all('teamRole/addToTeam').post({user_id: member.user.id}).then(function(response){
            member.isTeamMember = true;
        });
    }

    $scope.toggleAgent = function(member){
        var agent = _.findWhere(member.type ,{role_type : 5});
        if(agent){
            Restangular.one('userRole' , agent.id).remove().then(function(response){
                member.type = _.without(member.type , agent);
            })
        }
        else{
            Restangular.all('userRole').post({role_type : 5 , role_id : member.id}).then(function(response){
                member.type.push(response);
                if( !member.isTeamMember )
                    $scope.addToTeam( member );
            })
        }
    }

    $scope.stopPropagation = function($event){
        $event.stopPropagation();
    }

    $scope.addAccessPass = function(member) {
        if( typeof member.new_access_level != 'undefined' && member.new_access_level != '' && member.new_access_level != 0 ) {
            member.new_access_pass_saving = true;
            member.new_access_pass = {
                access_level_id: member.new_access_level,
                user_id: member.user_id,
                site_id: $site.id
            }
            Restangular.service("pass").post(member.new_access_pass).then(function (response) {
                toastr.success("Access pass created!");
                member.new_access_pass_saving = false;
                member.new_access_level = 0;
                member.access_level.push(member.new_access_pass);
                member.access_level_selection = false;
            });
        }
    }

    $scope.isOwner = function(member){
        var p_owner = _.findWhere(member.type ,{role_type : 1}) || _.findWhere(member.type ,{role_type : "1"});
        var owner = _.findWhere(member.type ,{role_type : 2}) || _.findWhere(member.type ,{role_type : "2"});
        var manager = _.findWhere(member.type ,{role_type : 3}) || _.findWhere(member.type ,{role_type : "3"});
        if( p_owner || owner || manager){
            return true;
        }
        return false;
    }

     $scope.isAgent = function(member){
        var agent = _.findWhere(member.type ,{role_type : 5}) || _.findWhere(member.type ,{role_type : "5"});
        if(agent){
            return true;
        }
        return false;
    }

    $scope.isAdmin = function(member){
        var admin = _.findWhere(member.type ,{role_type : 4}) || _.findWhere(member.type ,{role_type : "4"});
        if(admin){
            return true;
        }
        return false;
    }

    $scope.delete = function (member) {
        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return member.id
                }
            }
        });
        modalInstance.result.then(function () {
            Restangular.one('role' , member.id).remove().then(function () {
                $scope.data[ $scope.pagination.current_page] = _.without($scope.data[ $scope.pagination.current_page], member);
            });
        })
    };
});

app.controller('MemberDashboardController', function ($scope,$state, $localStorage, $modal, Restangular, toastr) {
    $scope.showModal = function(){
        $name = 'Member Stats Dashboard';
        console.log($state.current.name);
        if($state.current.name=='admin.tracking-code')
            $name = 'Tracking Code';
        else if($state.current.name == 'admin.affiliate-dashboard')
            $name = 'Affiliate Dashboard'
        $scope.message = 'The' +$name+' will arrive shortly, so hold tight!';
        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/comingSoon.html',
            controller: "modalController",
            scope: $scope,
        });
    }       
});

app.controller('adminNotificationsController', function ($scope,$state, $localStorage, $site , $modal, Restangular, toastr) {
    $scope.template_data = {
        title: 'SITE NOTICES',
        description: 'toastr your members of new things',
        singular: 'site notice',
        edit_route: 'admin.site.membership.notice',
        api_object: 'siteNotice'
    }

    $scope.data = [];
    $scope.pagination = {current_page: 1};
    $scope.pagination.total_count = 1;

    $scope.paginate = function(){

        if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page, site_id: $site.id};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
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
        var $params = { site_id :$site.id , p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
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

app.controller('adminNotificationController', function ($scope,$state, $localStorage, $notification , $modal, Restangular, toastr, Upload) {
    

    if($notification.id)
    {
        $scope.site_notice = $notification;
        $scope.site_notice.sdate = new Date(moment.utc($scope.site_notice.start_date));
        $scope.site_notice.edate = new Date(moment.utc($scope.site_notice.end_date));
    }
    else
    {
        $scope.site_notice={};
        $scope.site_notice.on=false;
        $scope.site_notice.sdate = new Date(moment().add(1,'days'));
        $scope.site_notice.edate = new Date(moment().add(2,'days'));
    }
    
    
    

    $scope.save = function () {
        $scope.site_notice.start_date=$scope.site_notice.sdate;
        $scope.site_notice.end_date=$scope.site_notice.edate;

        $date=moment(Date.now());
        $startdate=moment.utc($scope.site_notice.start_date);
        $enddate=moment.utc($scope.site_notice.end_date);

        if($date.isBetween(moment.utc($scope.site_notice.start_date),moment.utc($scope.site_notice.end_date)))
        {
            $scope.site_notice.on=true;
        }

        
        delete $scope.site_notice.sdate;
        delete $scope.site_notice.edate;

        if ($scope.site_notice.id) {
            $scope.site_notice.put();
            toastr.success("Site notice has been saved");
            $state.go('admin.site.membership.notices');
        }
        else {
            Restangular.all('siteNotice').post($scope.site_notice).then(function (site_notice) {
                $scope.site_notice = site_notice;
                toastr.success("Site notice has been saved");
                $state.go('admin.site.membership.notices');
            });
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

app.controller('MembersSummaryController', function ($scope, $state, Restangular, $summary) {
    $scope.summary = $summary;
    $scope.series = ['Members'];
  
    $scope.charts = [];

     $scope.init = function () {
        $scope.charts[0] = {"data" : [[]], "labels" : []};

         if ($summary) {
            $.each($summary.members_overtime, function (key, data) {
                $scope.charts[0].data[0].push(data.members);
                $scope.charts[0].labels.push(data.month);
            });

        }
        $scope.charts[1] = {"data" : [[]], "labels" : []}
        $scope.charts[1].data[0] = [$summary.members_today, $summary.members_yesterday];
        $scope.charts[1].labels = ["Today", "Yesterday"];

        $scope.charts[2] = {"data" : [[]], "labels" : []}
        $scope.charts[2].data[0] = [$summary.members_this_week, $summary.members_last_week];
        $scope.charts[2].labels = ["Current", "Last"];

        $scope.charts[3] = {"data" : [[]], "labels" : []}
        $scope.charts[3].data[0] = [$summary.members_this_month, $summary.members_last_month];
        $scope.charts[3].labels = ["Current", "Last"];
    };

    $scope.colours = [{
          "fillColor": "rgba(0, 102, 0, 1)",
          "strokeColor": "rgba(207,100,103,1)",
          "pointColor": "rgba(220,220,220,1)",
          "pointStrokeColor": "#fff",
          "pointHighlightFill": "#fff",
          "pointHighlightStroke": "rgba(151,187,205,0.8)"
    }];

    $scope.chart_options = {
        "pointDot" : false
    };

});

app.controller('MembersImportController', function($scope, $state, Restangular, toastr) {
    $scope.page_title = "Import Members";
    $scope.members = {};

    $scope.save = function() {
        Restangular.one("role").customPOST($scope.members, 'import').then(function(response) {
            toastr.success("Import was successful");
            $state.go('admin.site.membership.members');
        });
    }
});

