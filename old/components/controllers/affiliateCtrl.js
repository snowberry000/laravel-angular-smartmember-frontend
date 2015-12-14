app.controller('AffiliatesParentController', function ($scope, $rootScope , $localStorage,$state, $modal, Restangular, toastr) {
    if($rootScope.is_not_allowed){
        $state.go('admin.team.dashboard');
        return false;
    }
});

app.controller('AffiliatesController', function ($scope, $localStorage, $modal, $site ,Restangular) {
    $scope.template_data = {
        title: 'AFFILIATES',
        description: 'These are your "external promoters" - the people selling your Product(s).',
        singular: 'affiliate',
        edit_route: 'admin.team.jv.affiliate',
        api_object: 'affiliate'
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

app.controller('AffiliateController', function ($scope, $localStorage, Restangular, toastr, $state, affiliate,$site) {
    $scope.affiliate = affiliate;
    $scope.page_title = $scope.affiliate.id ? 'Edit Affiliate' : 'Create Affiliate';
    $scope.save = function(){
        console.log($scope.affiliate);
        if ($scope.affiliate.id){
            $scope.update();
            return;
        }
        $scope.create();
    }

    $scope.update = function(){
        $scope.affiliate.put().then(function(response){
            toastr.success("Changes saved!");
            $state.go("admin.team.jv.affiliates");
            
        });
    }

    $scope.create = function(){
        $scope.affiliate.company_id=$site.company_id;
        Restangular.service("affiliate").post($scope.affiliate).then(function(response){
            toastr.success("Created!");
            $state.go("admin.team.jv.affiliates");
        });
    }
});

app.controller('JVZooController', function ($scope, $localStorage, toastr, $state, company_hash) {
    $scope.url = $scope.app.apiUrl + '/jvzoo/' + company_hash;

    $scope.init = function(){
        var clipboard = new Clipboard('#copy-button');
    }

    $scope.copied = function()
    {
        toastr.success("Link copied!");
    }

});

app.controller('JVPageController', function ($scope, Restangular, $localStorage, $location, toastr, $state, $site, emailLists, Upload) {
    $scope.emailLists = emailLists;
    $scope.jv = {}
    $scope.isChecked = false; 
    $scope.urlPopover = {isOpen : false};
    $scope.loading = true;

    $scope.init = function() {
        Restangular.all('affiliateJVPage').getList({company_id : $site.company_id}).then(function (jv) {
            $scope.loading = false;
            if(jv.length>0){
                $scope.jv = jv[0];
            } 
            else {
                $scope.jv.company_id = $site.company_id;  
                $scope.jv.title = "";
            }

            $scope.jv.subscribe_button_text = $scope.jv.subscribe_button_text ? 
                                                    $scope.jv.subscribe_button_text : '';
        });
    }

    $scope.save = function () {
        delete $scope.jv.email_list;

        if ($scope.jv.id) {
            $scope.jv.put();
            toastr.success("JV Page has been saved!");
            $state.go('admin.site.pages.core.list');
        }
        else {
            Restangular.all('affiliateJVPage').post($scope.jv).then(function (jv) {
                $scope.jv = jv;
                toastr.success("JV Page has been saved!");
                $state.go('admin.site.pages.core.list');
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
        var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle'];
      
        if(!selected_url)
          return;

        if(api_resources.indexOf(selected_url)<0)
        {
          $scope.jv.redirect_url = selected_url;
          item.url = selected_url;

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

app.controller('affiliateContestController', function ($scope, $state, $stateParams, Restangular) {
    //console.log($affiliateContest);
    $scope.loading=true;
    if($stateParams.permalink)
        Restangular.one('affiliateContestByPermalink' , $stateParams.permalink).get().then(function(response){
            $affiliateContest=response;
            $scope.loading=false;
            $scope.affiliateContest=$affiliateContest;
            $scope.getLeaderBoard();
        });
    else
    {
        $scope.loading=false;
        $affiliateContest = $site.company_id;
        $scope.getLeaderBoard();
    }
        

    $scope.getLeaderBoard = function()
    {
        Restangular.one('affiliateLeaderboard', $affiliateContest.id).get().then(function(response){
            console.log(response);
            $scope.leaderboard=response;
        });
    }
    
});
app.controller('AffiliatesSummaryController', function ($scope, $state, Restangular, $summary , $user) {
    $scope.summary = $summary;
    $scope.series = ['Affiliates'];

    $scope.hasAccess=function(role)
    {
        if( typeof role == 'undefined' )
            role = $user.role;

        for (var i = role.length - 1; i >= 0; i--) {
            var Manager = _.findWhere(role[i].type ,{role_type : 3});
            if( !Manager )
                Manager = _.findWhere(role[i].type ,{role_type : "3"});
            var Owner = _.findWhere(role[i].type ,{role_type : 2});
            if( !Owner )
                Owner = _.findWhere(role[i].type ,{role_type : "2"});
            var PrimaryAdmin = _.findWhere(role[i].type ,{role_type : 1});
            if( !PrimaryAdmin )
                PrimaryAdmin = _.findWhere(role[i].type ,{role_type : "1"});
            if(Manager || Owner || PrimaryAdmin){
                return true;
            }
        }
        return false;
    }

    var access = $scope.hasAccess($user.role);
    console.log("My access is" + access)
    if($state.current.name.split('.')[1]=='smartmail'){
        console.log(access)
        if(!access ){
            $state.go('admin.account.memberships');
        }
    }
  
    $scope.charts = [];

     $scope.init = function () {
        $scope.charts[0] = {"data" : [[]], "labels" : []};

         if ($summary && $summary.success !=false) {
            $.each($summary.affiliates_overtime, function (key, data) {
                $scope.charts[0].data[0].push(data.affiliates);
                $scope.charts[0].labels.push(data.month);
            });

        }
        $scope.charts[1] = {"data" : [[]], "labels" : []}
        $scope.charts[1].data[0] = [$summary.affiliates_today, $summary.affiliates_yesterday];
        $scope.charts[1].labels = ["Today", "Yesterday"];

        $scope.charts[2] = {"data" : [[]], "labels" : []}
        $scope.charts[2].data[0] = [$summary.affiliates_this_week, $summary.affiliates_last_week];
        $scope.charts[2].labels = ["Current", "Last"];

        $scope.charts[3] = {"data" : [[]], "labels" : []}
        $scope.charts[3].data[0] = [$summary.affiliates_this_month, $summary.affiliates_last_month];
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
