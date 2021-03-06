var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.email.list",{
			url: "/list/:id?",
			templateUrl: "/templates/components/public/app/admin/email/list/list.html",
			controller: "smartMailListController"
		})
}); 

app.controller("smartMailListController", function ($scope,smModal,$rootScope, $stateParams, $localStorage, Restangular, toastr, $state) {
	$site=$rootScope.site;
	emailList=null;

	$scope.template_data = {
		api_object: 'emailSubscriber'
	}

	$scope.data = [];

	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );

	$scope.paginate = function(search)
	{
		if (search)
		{
			$scope.pagination.current_page = 1;
		}

		if( true )
		{

			$scope.loading = true;

			var $params = { p: $scope.pagination.current_page };

			if( $scope.query )
			{
				$params.q = encodeURIComponent( $scope.query );
			}

			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?emaillist_id=' + $stateParams.id + '&view=admin&p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
			{
				$scope.loading = false;
				$scope.pagination.total_count = data.total_count;
				$scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
			} );
		}
	}

	$scope.deleteResource = function( id )
	{
		var itemWithId = _.find( $scope.data, function( next_item )
		{
			return next_item.id === parseInt(id);
		} );

		Restangular.one( 'emailSubscriber/unsubscribeList' ).customPOST({subscriber: itemWithId, list_id: $stateParams.id}).then( function()
		{
			$scope.data = _.without( $scope.data, itemWithId );
		} );
	};

	$scope.resolve = function ()
	{
		if ($stateParams.id){
			Restangular.one('emailList', $stateParams.id).get().then(function(response){
				emailList=response;
				$scope.emailList = emailList;
				$scope.initialize();
				$scope.paginate();
			});
		}
		else
		{
			emailList={company_id: $site.company_id};
			$scope.emailList=emailList;
			$scope.initialize();
		}
	}

	$scope.initialize = function () {
		if (!Modernizr.inputtypes.date) {
          // no native support for <input type="date"> :(
          // maybe build one yourself with Dojo or jQueryUI
          $('input[type="date"]').datepicker();
          $('input[type="date"]' ).datepicker( "option", "dateFormat", 'yy-mm-dd' );
        }

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
	}

	$scope.resolve();

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
	        $state.go("public.app.admin.email.import",{id:$scope.emailList.id});
	        return;
	    }
	    $scope.emailList.company_id = $site.company_id;
	    Restangular.service("emailList").post($scope.emailList).then(function(response){
	        toastr.success("List created!");
	        $state.go("public.app.admin.email.import",{id:response.id});
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
	        $state.go("public.app.admin.email.lists");
	    })
	}

	$scope.create = function(){
	    $scope.emailList.company_id = $site.company_id;
	    Restangular.service("emailList").post($scope.emailList).then(function(response){
	        toastr.success("List created!");
	        $state.go("public.app.admin.email.lists");
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