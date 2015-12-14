app.controller('SmartMailAutoRespondersController', function ($scope,$filter, $localStorage, $modal, Restangular, notify) {
    $scope.template_data = {
        title: 'AUTORESPONDERS',
        description: 'Autoresponders let you queue up emails to send to subscribers day by day, week by week on a scheduled basis starting for each subscriber uniquely based on their subscribe date.',
        singular: 'autoresponder',
        edit_route: 'admin.team.email.autoresponder',
        api_object: 'emailAutoResponder'
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


app.controller('SmartMailAutoResponderController', function ($filter,$scope, $localStorage, Restangular,toastr, $site,notify, $state, autoResponder, emails, emailLists) {
    $scope.emails = emails;
    $scope.emailLists = emailLists;
    $scope.autoResponder = autoResponder;
    $scope.emailId = false;
    if (!$scope.autoResponder.id){
        $scope.autoResponder.emails = [];
    }
    else
    {
        $scope.tempAutoResponder={company_id:$site.company_id,emails:[],lists:{}};
        for(var i=0;i<$scope.autoResponder.emails.length;i++)
        {
            $scope.tempAutoResponder.emails.push({email_id:$scope.autoResponder.emails[i].id, subject:$scope.autoResponder.emails[i].subject, delay:$scope.autoResponder.emails[i].pivot.delay, unit:$scope.autoResponder.emails[i].pivot.unit,sort_order:$scope.autoResponder.emails[i].pivot.sort_order});
        }
        for(var i=0;i<$scope.autoResponder.email_lists.length;i++)
        {
            $scope.tempAutoResponder.lists[$scope.autoResponder.email_lists[i].id]=true;
        }
        delete $scope.autoResponder.emails;
        $scope.autoResponder.emails=$scope.tempAutoResponder.emails;
        $scope.autoResponder.lists=$scope.tempAutoResponder.lists;
        delete $scope.autoResponder.email_lists;
        $scope.autoResponder.emails=$filter('orderBy')($scope.autoResponder.emails, 'sort_order');
    }



    $scope.addEmail = function() {
        if (!$scope.emailId) return;

        var email = _.find($scope.emails, function(email) {
            return email.id == $scope.emailId;
        });
        
        var alreadyAdded = _.find($scope.autoResponder.emails, function(autoEmail) {
            return email.id == autoEmail.email_id;
        });

        // var alreadyAdded = _.findWhere(autoResponder.emails, {email_id : email.id});

        if ( !alreadyAdded ) {
            if( $scope.autoResponder.emails.length > 0 )
                $scope.autoResponder.emails.push({email_id:email.id, subject:email.subject, delay:1, unit:2});
            else
                $scope.autoResponder.emails.push({email_id:email.id, subject:email.subject, delay:0, unit:1});
        }

    }

    $scope.removeEmail = function(email_id) {
        var email = _.find($scope.autoResponder.emails, {email_id: email_id});
        $scope.autoResponder.emails = _.without( $scope.autoResponder.emails, email );
    }

    $scope.dragControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope){
            return true;
        },
        itemMoved: function ($event) {console.log("moved");},//Do what you want},
        orderChanged: function($event) {console.log("orderchange");},//Do what you want},
        
        dragEnd: function ($event) {
            $(window).off();
        },
        containment: '#board'//optional param.
    };

    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };


    $scope.save = function(){
        
        console.log($scope.autoResponder);
        $scope.autoResponder.emails=[];
        $.each($(".email_item"), function (key, email) {
            $tempEmail=$(email).data("component");
            $tempEmail.sort_order=key;
            $scope.autoResponder.emails.push($tempEmail);
        });
        if ($scope.autoResponder.id){
            $scope.update();
            return;
        }
        $scope.create();
    }

    $scope.update = function(){
        $scope.autoResponder.put().then(function(response){
            toastr.success("Changes Saved!");
            $state.go("admin.team.email.autoresponders");
        })
    }

    $scope.create = function(){
        Restangular.service("emailAutoResponder").post($scope.autoResponder).then(function(response){
            // notify({
            //         message:"Auto Responder created!",
            //         classes: 'alert-success',
            //         templateUrl : 'templates/modals/notifyTemplate.html'
            //     });
            toastr.success("Auto Responder created!");
            $state.go("admin.team.email.autoresponders");
        });
    }
});