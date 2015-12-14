app.controller('SmartMailListsController', function ($scope, $localStorage,$site , $location,  $modal, Restangular, toastr) {
    $scope.blockCalls=false;
    $scope.processingCall=false;
    $scope.currentPage = 1;
    $scope.loading = true;

    Restangular.all('emailList').getList()
        .then(function(response){
            console.log(response);
            $scope.emailLists = response;
            $scope.loading = false;
        })


    $scope.search = function()
    {
        $scope.emailLists = [];
        $scope.currentPage = 0;
        var $params = { company_id: $site.company_id ,p : ++$scope.currentPage};
        if ($scope.query){
            $params.q = $scope.query;
        }

        Restangular.all('emailList').getList($params).then(function(data){
            for (var i = data.length - 1; i >= 0; i--) {
                var match = _.findWhere($scope.emailLists ,{id : data[i].id});
                if(!match)
                    $scope.emailLists.push(data[i]);
            };
            if(data.length==0) {
                $scope.emailLists = [];
                $scope.blockCalls = true;
            } else {
                $scope.blockCalls=false;
            }
        } , function(error){
            $scope.emailLists = [];
        })
    }

    $scope.loadMore = function(){

        if(!$scope.blockCalls && !$scope.processingCall)
        {
            $scope.processingCall=true;
            var $params = {p:++$scope.currentPage , company_id :$site.company_id};
            if ($scope.query) {
                $params.q = $scope.query;
            }

            Restangular.all('emailList').getList($params).then(function (emailLists) {
                $scope.emailLists = $scope.emailLists.concat(emailLists);
                
                if(emailLists.length == 0)
                     $scope.blockCalls=true;

                $scope.processingCall=false;
            });
        } else
            return;
    }

    $scope.delete = function (emailListId) {
        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return emailListId
                }
            }

        });
        modalInstance.result.then(function () {
            var emailListWithId = _.find($scope.emailLists, function (emailList) {
                return emailList.id === emailListId;
            });

            emailListWithId.remove().then(function () {
                $scope.emailLists = _.without($scope.emailLists, emailListWithId);
            });
        })
    };
});

app.controller('SmartMailListController', function ($scope, $localStorage, Restangular, toastr, $state, emailList, $site) {
    $scope.emailList = emailList;

    $scope.dirty = {};

    if ($scope.emailList.segment_query)
        $scope.dirty.value = $scope.emailList.segment_query;

    if ($scope.emailList.subscribers)
    {
        var result = [];
        angular.forEach($scope.emailList.subscribers, function(value) {
            this.push(value.email);
        }, result);

        $scope.emailList.subscribers = result.join(',');
    }

    $scope.save = function(){
        $scope.emailList.segment_query = $scope.dirty.value;
        if ($scope.emailList.id){
            $scope.update();
            return;
        }
        $scope.create();
    }



    $scope.saveAndImport = function(){
        $scope.emailList.segment_query = $scope.dirty.value;

        if ($scope.emailList.id){
            $scope.emailList.put().then(function(response){
                for (var i = 0; i < $scope.emailList.length; i++) {
                    if($scope.emailList[i].id == response.id){
                        $scope.emailList[i] = response;
                    }
                };
                toastr.success("List updated!");
            })
            $state.go("admin.team.email.import",{id:$scope.emailList.id})
            return;
        }
        $scope.emailList.company_id = $site.company_id;
        Restangular.service("emailList").post($scope.emailList).then(function(response){
            toastr.success("List created!");
            $state.go("admin.team.email.import",{id:response.id})
        });

    }

    $scope.update = function(){
        console.log(emailList);
        $scope.emailList.put().then(function(response){
            for (var i = 0; i < $scope.emailList.length; i++) {
                if($scope.emailList[i].id == response.id){
                    $scope.emailList[i] = response;
                }
            };
            toastr.success("List updated!");
            $state.go("admin.team.email.lists");
        })
    }

    $scope.create = function(){
        $scope.emailList.company_id = $site.company_id;
        Restangular.service("emailList").post($scope.emailList).then(function(response){
            toastr.success("List created!");
            $state.go("admin.team.email.lists");
        });
    }

    //TODO: Move the code below for segment tool to its own file. 
    var objects = {};
    //TODO We can consider fetching this from server
    var attributes = {
        'role' :  function(term, lhs) {
            var q = term.toLowerCase().trim();
            var values = ['Primary Owner', 'Owner', 'Manager', 'Admin', 'Agent', 'Member'];
            var result = [];

            for (var i = 0; i < values.length && values.length < 10; i++) {
                var value = values[i];
                if (value.toLowerCase().indexOf(q) === 0) {
                    result.push({ label: '"' + value + '"', value: lhs + '"' + value + '"' });
                }
            }
            return result;
        },
        'access_pass' : function(term, lhs) {
            return Restangular.all('accessLevel').getList({site_id : $site.id, q : term}).then(function(response) {
                var result = [];
                $.each(response, function(key, data) {
                    result.push({ label: '"' + data.name + '"', value: lhs + '"' + data.name + '"' });

                });

                return result;
            });
        },
        'refund_pass' : function(term, lhs) {
            return Restangular.all('accessLevel').getList({site_id : $site.id, q : term}).then(function(response) {
                var result = [];
                $.each(response, function(key, data) {
                    result.push({ label: '"' + data.name + '"', value: lhs + '"' + data.name + '"' });

                });

                return result;
            });
        },
        // 'email_list' : function(term, lhs) {
        //     return Restangular.all('emailList').getList({company_id : $site.company_id, list_type : 'user', q : term}).then(function(response) {
        //         var result = [];
        //         $.each(response, function(key, data) {
        //             result.push({ label: '"' + data.name + '"', value: lhs + '"' + data.name + '"' });
        //         });

        //         return result;
        //     });
        // },
        'support_ticket' :  function(term, lhs) {
            var q = term.toLowerCase().trim();
            var values = ['new', 'pending customer reply', 'closed', 'awaiting support review', 'need_review', 'solved'];
            var result = [];

            for (var i = 0; i < values.length && values.length < 10; i++) {
                var value = values[i];
                if (value.toLowerCase().indexOf(q) === 0) {
                    result.push({ label: '"' + value + '"', value: lhs + '"' + value + '"' });
                }
            }
            return result;
        },
        'transaction' : function(term, lhs) {
            var q = term.toLowerCase().trim();
            var values = ['Sale', 'Refund', 'Rebill', 'Cancel Rebill'];
            var result = [];
            for (var i = 0; i < values.length && values.length < 10; i++) {
                var value = values[i];
                if (value.toLowerCase().indexOf(q) === 0) {
                    result.push({ label: '"' + value + '"', value: lhs + '"' + value + '"' });
                }
            }
            return result;
        }
    };

    var SELECTION_ATTRIBUTE = 0;
    var SELECTION_OPERATOR = 1;
    var SELECTION_VALUE = 2;
    var SELECTION_CONNECTOR = 3;

    var selection = SELECTION_ATTRIBUTE;

    function suggest_(values, term, quotes) {
        var q = term.toLowerCase().trim();
        var results = [];
        for (var i = 0; i < values.length && values.length < 10; i++) {
            var value = values[i];
            if (value.toLowerCase().indexOf(q) === 0) {
                quotes !== 'undefined' && quotes && (value = '"' + value + '"');
                results.push({ label: value, value: value });
            }
        }

        return results;
    }

    function suggest_attributes(term) {
        var results = [];
        var values = Object.keys(attributes);

        return suggest_(values, term);
       
    }

    // TODO operator suggestion should be based on attribute data type. 
    function suggest_operators(term) {
        var values = ['=' , '!='];
        return suggest_(values, term);
    }

    function suggest_values(term, lhs) {
        var res = $scope.dirty.value.match(/(?:[^\s"]+|"[^"]*")+/g);

        var current_attribute = false;

        if (!term || term.trim().lenght == 0)
            current_attribute = res[res.length - 2];
        else
            current_attribute = res[res.length - 3];

        if (current_attribute)
            current_attribute = current_attribute.toLowerCase();
        else
            return;

        console.log("Query attribute " + current_attribute);
        // if (! attributes.current_attribute) return;

        return attributes[current_attribute](term, lhs);
    }

    function suggest_connector(term) {
        return suggest_(['AND', 'OR'], term);
    }

    function suggestNext(term, lhs) {
        console.log("Selection eff" + selection);

        switch (selection) {
            case SELECTION_ATTRIBUTE:
                return suggest_attributes(term);
            case SELECTION_OPERATOR:
                return suggest_operators(term);
            case SELECTION_VALUE:
                return suggest_values(term, lhs);
            case SELECTION_CONNECTOR:
                return suggest_connector(term);
        }
    }

    function suggest_delimited(term) {
        var res = term.match(/(?:[^\s"]+|"[^"]*")+/g);
        var expressions = 0;

        if (res && res.length > 0)  {
            expressions = Math.floor(res.length / 4);       
            selection = (res.length - (4 * expressions) - 1);
        }
    

        var ix = term.lastIndexOf(' ');
        if ( ix != -1 && ix == ( term.length - 1) )
            selection = selection + 1;

        lhs = term.substring(0, ix + 1);
        rhs = term.substring(ix + 1);

        suggestions = suggestNext(rhs, lhs);

        if (selection != SELECTION_VALUE) {
                suggestions.forEach(function (s) {
                s.value = lhs + s.value;
            });    
        }
        
        return suggestions;
    };

    $scope.autocomplete_options = {
        suggest: suggest_delimited,
        on_attach: on_attach,
    };

    function on_attach() {
        console.log("Attached");
    }
});