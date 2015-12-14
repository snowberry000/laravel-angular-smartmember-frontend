app.controller('SmartMailSubscribersController', function ($scope, $localStorage, $modal, Restangular, toastr, $site, $state) {
    $scope.template_data = {
        title: 'SUBSCRIBERS',
        description: 'Email subscribers include - but not withstanding - your members, leads, and anyone who opts into any of the pages on your site.',
        singular: 'subscriber',
        edit_route: 'admin.team.email.subscriber',
        api_object: 'emailSubscriber'
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

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p  + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
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


app.controller('SmartMailSubscriberController', function ($scope, $localStorage, Restangular, toastr, $state, emailSubscriber, emailLists,$site) {
    $scope.emailsubscriber = emailSubscriber;
    $scope.emailSubscribers = [];
    $scope.emailLists = emailLists;
    console.log($scope.emailsubscriber);

    if ($scope.emailsubscriber.email_lists) {
        $scope.emailsubscriber.lists = {};
        $.each($scope.emailsubscriber.email_lists, function(key, data) {
            $scope.emailsubscriber.lists[data.id] = true;
        });
    }

    $scope.addInSubscribersList = function(){
        var $name_emailArr=[];
        var $name="";
        $scope.totalAdded=0;
        if($scope.emailsubscriber.email!=''&&$scope.emailsubscriber.email!=null)
        {
            $name=$scope.emailsubscriber.name;
            $emailArr = $scope.emailsubscriber.email.split("\n");
            for(var i=0;i<$emailArr.length;i++)
            {
                $name_emailArr=$emailArr[i].split(";");
                if($name_emailArr.length>1)
                {
                    if(_.isEmpty($scope.emailsubscriber.lists))
                        return;
                    $scope.emailsubscriber.email="";
                    $scope.emailsubscriber.email=$name_emailArr[1];
                    $scope.emailsubscriber.name=$name_emailArr[0];
                    $obj=angular.copy($scope.emailsubscriber);
                    $scope.emailSubscribers[$scope.emailSubscribers.length] = $obj;
                }
                else
                {
                    if(_.isEmpty($scope.emailsubscriber.lists))
                        return;
                    $scope.emailsubscriber.email="";
                    $scope.emailsubscriber.name=$name;
                    $scope.emailsubscriber.email=$name_emailArr[0];
                    $obj=angular.copy($scope.emailsubscriber);
                    $scope.emailSubscribers[$scope.emailSubscribers.length] = $obj;
                }
            }
            $scope.emailsubscriber = {company_id : emailSubscriber.company_id};
            
        }
    }

    $scope.removeFromList = function($argSubs){
        console.log($argSubs);
        $scope.emailSubscribers = _.reject($scope.emailSubscribers, function($subs){ return $subs.name == $argSubs.name&&$subs.email == $argSubs.email; });
    }

    $scope.saveList= function()
    {
        $scope.sendIter=0;
        $scope.redirect=false;
        for(var i=0;i<$scope.emailSubscribers.length;i++)
        {
            if(i==($scope.emailSubscribers.length-1))
                $scope.redirect=true;
            $scope.save($scope.emailSubscribers[i]);
        }
    }

    $scope.save = function($saveSubscriber){
        if ($saveSubscriber.id){
            $scope.update($saveSubscriber);
            return;
        }
        $scope.create($saveSubscriber);
        
    }

    $scope.update = function($saveSubscriber){
        $saveSubscriber.company_id=$site.company_id;
        $saveSubscriber.put().then(function(response){
            toastr.success("Changes Saved!");
            $scope.sendIter++;
            if($scope.redirect)
                $state.go("admin.team.email.subscribers");
        })
    }

    $scope.create = function($saveSubscriber){
        $saveSubscriber.company_id=$site.company_id;
       
        Restangular.service("emailSubscriber").post($saveSubscriber).then(function(response){
            $scope.sendIter++;
            if(response.total!=0)
                $scope.totalAdded+=1;
            if($scope.sendIter==$scope.emailSubscribers.length)
            {
                console.log("i am printing subscribers count "+$scope.sendIter);
                toastr.success($scope.totalAdded+" Subscribers Added!");
                $state.go("admin.team.email.subscribers");
            }
        });
    }
});


app.controller('SmartMailImportSubscriberController', function ($scope, $localStorage, Restangular, toastr, $state, emailListId, emailLists,$site) {
    $scope.emailsubscriber = {email_lists:[]};
    $scope.emailsubscriber.email_lists.push(emailListId);
    $scope.emailLists = emailLists;
    $scope.totalAdded+=1;
    if ($scope.emailsubscriber.email_lists) {
        $scope.emailsubscriber.lists = {};
        $.each($scope.emailsubscriber.email_lists, function(key, data) {
            $scope.emailsubscriber.lists[data.id] = true;
        });
    }
    $scope.emailSubscribers = [];

    $scope.addInSubscribersList = function(){
        var $name_emailArr=[];
        var $name="";
        $scope.totalAdded=0;
        if($scope.emailsubscriber.email!=''&&$scope.emailsubscriber.email!=null)
        {
            $name=$scope.emailsubscriber.name;
            $emailArr = $scope.emailsubscriber.email.split("\n");
            for(var i=0;i<$emailArr.length;i++)
            {
                $name_emailArr=$emailArr[i].split(";");
                if($name_emailArr.length>1)
                {
                    if(_.isEmpty($scope.emailsubscriber.lists))
                        return;
                    $scope.emailsubscriber.email="";
                    $scope.emailsubscriber.email=$name_emailArr[1];
                    $scope.emailsubscriber.name=$name_emailArr[0];
                    $obj=angular.copy($scope.emailsubscriber);
                    $scope.emailSubscribers[$scope.emailSubscribers.length] = $obj;
                }
                else
                {
                    if(_.isEmpty($scope.emailsubscriber.lists))
                        return;
                    $scope.emailsubscriber.email="";
                    $scope.emailsubscriber.name=$name;
                    $scope.emailsubscriber.email=$name_emailArr[0];
                    $obj=angular.copy($scope.emailsubscriber);
                    $scope.emailSubscribers[$scope.emailSubscribers.length] = $obj;
                }
            }
            $scope.emailsubscriber = {company_id : $site.company_id};
            
        }
    }

    $scope.removeFromList = function($argSubs){
        console.log($argSubs);
        $scope.emailSubscribers = _.reject($scope.emailSubscribers, function($subs){ return $subs.name == $argSubs.name&&$subs.email == $argSubs.email; });
    }

    $scope.saveList= function()
    {
        $scope.redirect=false;
        $scope.sendIter=0;
        for(var i=0;i<$scope.emailSubscribers.length;i++)
        {
            if(i==($scope.emailSubscribers.length-1))
                $scope.redirect=true;
            $scope.save($scope.emailSubscribers[i]);
        }
    }

    $scope.save = function($saveSubscriber){
        if ($saveSubscriber.id){
            $scope.update($saveSubscriber);
            return;
        }
        $scope.create($saveSubscriber);
    }

    $scope.update = function($saveSubscriber){
        $saveSubscriber.company_id=$site.company_id;
        $saveSubscriber.put().then(function(response){
            $scope.sendIter++;
            toastr.success("Changes Saved!");
            if($scope.sendIter==$scope.emailSubscribers.length-1)
            {
                $state.go("admin.team.email.subscribers");
            }
        })
    }

    $scope.create = function($saveSubscriber){
        $saveSubscriber.company_id=$site.company_id;
       
        Restangular.service("emailSubscriber").post($saveSubscriber).then(function(response){
            if(response.total!=0)
            {
                $scope.totalAdded+=1;
            }
            $scope.sendIter++;
            if($scope.sendIter==$scope.emailSubscribers.length)
            {
                console.log("i am printing subscribers count "+$scope.sendIter);
                toastr.success($scope.totalAdded+" Subscribers Added!");
                $state.go("admin.team.email.subscribers");
            }
        });
    }
});

app.controller('SmartMailDownloadSubscribersController', function( $scope, $modal, $localStorage, Restangular, toastr, $state, emailLists, sites, emails, accessLevels, superAdmin, Upload) {
    $scope.emailLists = emailLists;
    $scope.accessLevels = accessLevels;
    $scope.isSuperAdmin = superAdmin.isSuperAdmin;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.pagination = {currentPage : 1};
    $scope.users = [];
    $scope.queueEmailData = {
        email_id: false,
        siteMembers: [],
        emailLists: [],
        accessLevels: [],
        ownershipTypes: {
            owned: true,
            refunded: false
        },
        segmentQuery: '',
        smUsers: {
            primaryOwners: false,
            owners: false
        }
    };

    $scope.sites = sites.sites;
    $scope.emails = emails;

    $scope.paginateIt = function() {
        var begin = (($scope.pagination.currentPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

        $scope.users_to_show = $scope.users.slice(begin, end);
    }

    $scope.stopPropagation = function($event){
        $event.stopPropagation();
    }

    $scope.selectAllSites = function() {
        angular.forEach( $scope.sites, function(value, key){
            $scope.queueEmailData.siteMembers[value.id] = true;
        })
    }

    $scope.selectAllEmailLists = function() {
        angular.forEach( $scope.emailLists, function(value, key){
            $scope.queueEmailData.emailLists[value.id] = true;
        })
    }

    $scope.selectAllAccessLevels = function() {
        angular.forEach( $scope.accessLevels, function(value, key){
            $scope.queueEmailData.accessLevels[value.id] = true;
        })
    }

    $scope.toggleDropdown = function(itemToSkip){
        var dropdowns = [
            'email_list_selector',
            'site_members_selector',
            'access_levels_selector',
            'ownership_type_selector',
            'sm_user_selector'
        ];

        angular.forEach( dropdowns, function( value ){
            if( value != itemToSkip )
                $scope[ value ] = false;
        });
        $scope[ itemToSkip ] = !$scope[ itemToSkip ];
    }

    $scope.send = function(){
            

                /*$scope.queueEmailData['action'] = 3; // Send
                $scope.queueEmailData['_method'] = 'PUT';
                var new_hour = moment($scope.queueEmailData['send_time']).hours();
                var new_minute = moment($scope.queueEmailData['send_time']).minutes();
                var official_date = moment($scope.queueEmailData['send_date']).hours(new_hour);
                $scope.queueEmailData['send_date'] = moment(official_date).minutes(new_minute);*/
                Restangular.all('emailSubscriber/getCSV').customPOST({segment_query : $scope.queueEmailData.segmentQuery}).then(function(response){
                    //$state.go("my.smartmail.emailQueue");
                });
        

    }

    $scope.listChanged = function(){
        var lists = [];
        var sites = [];
        $scope.queueEmailData.segmentQuery = '';

        var subscriber_query = '';
        var member_query = '';
        if( $scope.queueEmailData.emailLists.indexOf(true) != -1) {
            var listsToCheck = [];
            angular.forEach($scope.queueEmailData.emailLists, function (value, index) {
                if (value) {
                    listsToCheck.push(index);
                }
            });
            subscriber_query += 'email_list_id IN (' + listsToCheck.join(',') + ')';
        } else {
            var listsToCheck = [];
            angular.forEach($scope.emailLists, function( value, index ) {
                listsToCheck.push(value.id);
            });
            subscriber_query += 'email_list_id IN (' + listsToCheck.join(',') + ')';
        }

        if( $scope.queueEmailData.siteMembers.indexOf(true) != -1) {
            member_query += member_query == '' ? '' : ' AND ';

            var sitesToCheck = [];
            angular.forEach($scope.queueEmailData.siteMembers, function (value, index) {
                if (value) {
                    var site = _.findWhere($scope.sites, {id: parseInt(index)}) || _.findWhere($scope.sites, {id: index + ''});
                    if (typeof site != 'undefined') {
                        sitesToCheck.push('"' + site.subdomain + '"');
                    }
                }
            });
            member_query += 'site IN (' + sitesToCheck.join(',') + ')';
        } else {
            member_query += member_query == '' ? '' : ' AND ';
            var sitesToCheck = [];
            angular.forEach($scope.sites, function( value, index ) {
                sitesToCheck.push('"' + value.subdomain + '"');
            });
            member_query += 'site IN (' + sitesToCheck.join(',') + ')';
        }

        if( $scope.queueEmailData.accessLevels.indexOf(true) != -1) {
            var accessPassesToCheck = [];
            var refundPassesToCheck = [];
            angular.forEach($scope.queueEmailData.accessLevels, function (value, index) {
                if (value) {
                    var access_level = _.findWhere($scope.accessLevels, {id: parseInt(index)}) || _.findWhere($scope.accessLevels, {id: index + ''});
                    if (typeof access_level != 'undefined') {
                        if ($scope.queueEmailData.ownershipTypes.owned == true)
                            accessPassesToCheck.push( '"' +  access_level.name + '"' );
                        if ($scope.queueEmailData.ownershipTypes.refunded == true)
                            refundPassesToCheck.push( '"' +  access_level.name + '"' );
                    }
                }
            });

            if ($scope.queueEmailData.ownershipTypes.owned == true) {
                member_query += member_query == '' ? '' : ' AND ';
                member_query += 'access_pass IN (' + accessPassesToCheck.join(',') + ')';
            }
            if ($scope.queueEmailData.ownershipTypes.refunded == true) {
                member_query += member_query == '' ? '' : ' AND ';
                member_query += 'refund_pass IN (' + refundPassesToCheck.join(',') + ')';
            }
        }

        if( $scope.isSuperAdmin ) {

            var smUserRoles = [];

            if( $scope.queueEmailData.smUsers.owners == true ) {
                smUserRoles.push('"Owner"');
            }
            if( $scope.queueEmailData.smUsers.primaryOwners == true ) {
                smUserRoles.push('"Primary Owner"');
            }

            if( smUserRoles.length > 0) {
                member_query += member_query == '' ? '' : ' AND ';
                member_query += 'role IN (' + smUserRoles.join(',') + ')';

                if( $scope.queueEmailData.accessLevels.indexOf(true) == -1 || $scope.queueEmailData.siteMembers.indexOf(true) == -1 )
                    member_query = 'role IN (' + smUserRoles.join(',') + ')';
            }
        }

        if( $scope.queueEmailData.accessLevels.indexOf(true) != -1 || $scope.queueEmailData.siteMembers.indexOf(true) != -1 || $scope.queueEmailData.emailLists.indexOf(true) != -1 || ( $scope.isSuperAdmin && smUserRoles.length > 0 ) )
        {
            if( $scope.queueEmailData.emailLists.indexOf(true) != -1 ) {
                if( $scope.queueEmailData.accessLevels.indexOf(true) != -1 || $scope.queueEmailData.siteMembers.indexOf(true) != -1 || ( $scope.isSuperAdmin && smUserRoles.length > 0 ) )
                    $scope.queueEmailData.segmentQuery = member_query + ' AND ' + subscriber_query ;
                else
                    $scope.queueEmailData.segmentQuery = subscriber_query;
            } else {
                $scope.queueEmailData.segmentQuery = member_query;
            }
        }
        else
        {
            $scope.queueEmailData.segmentQuery = member_query + ' OR ' + subscriber_query;
        }


        console.log(' Segment Query: ' + $scope.queueEmailData.segmentQuery)

       /* Restangular.one('emailList').customPOST({segment_query: $scope.queueEmailData.segmentQuery}, 'users')
            .then(function (response) {
                $scope.users = response;
                $scope.currentPage = 1;
                $scope.itemsPerPage = 10;
                $scope.pagination = {currentPage : 1};
                $scope.paginateIt();
            })*/
    }

    $scope.listChanged();
});