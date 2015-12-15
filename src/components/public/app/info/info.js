var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.info",{
			url: "/info",
			templateUrl: "/templates/components/public/app/info/info.html",
			controller: "InfoController"
		})
}); 

app.controller('InfoController', function ($scope, $rootScope,$location, $localStorage , $state, $stateParams,$modal, $filter, Restangular, notify,$location) {

    $scope.isLoggedIn = function()
    {
        if( $localStorage.user && $localStorage.user.id )
        {
            return true;
        }
        return false;
    }

	$scope.lesson_count = 0;
	$rootScope.page_title = 'Sales Page';
	$scope.salesPage=window.location.hash.substr(1);
	$scope.loading=true;

	if( $scope.isLoggedIn() && $scope.salesPage!='preview' )
	    $state.go('public.app.lessons',{},{location:false});

	if($scope.site.show_syllabus_toggle)
	{
	    if ($localStorage.syllabus_format){
	        $scope.site.syllabus_format = $localStorage.syllabus_format;
	    }
	}
	else
	{
	    delete $localStorage.syllabus_format;
	}
	/*Restangular.one('module', 'home').get().then(function(response){
	    $scope.loading=false;
	    $modules=response;
	    $scope.modules = $modules;
	    $scope.modules = _.reject($scope.modules,function($mod){
	        return $mod.lessons.length==0;
	    });
	    $.each($scope.modules, function (key, data) {
	        $.each(data.lessons, function (key, data) {
	            $scope.lesson_count++;
	            data.showCounter=$scope.lesson_count;
	            switch(parseInt(data.access_level_type)){
	                case 1:
	                    data.access = 'Public';
	                    break;
	                case 2:
	                    data.access = data.access_level !== undefined && data.access_level !== null && data.access_level.name !== undefined ? data.access_level.name : '';
	                    break;
	                case 3:
	                    data.access = 'Members';
	                    break;
	                case 4:
	                    data.access = 'Draft (admin-only)';
	                    break;
	            }
	            if (data.content != undefined && typeof(data.content) == "string")
	                data.description = $scope.excerpt( data.content );
	            else
	                data.description = data.content;
	        });
	        data.lessons = _.toArray(data.lessons);
	    });

	    $rootScope.Modulelessons=[];
	    for(var i=0;i<$scope.modules.length;i++)
	    {   
	        $rootScope.Modulelessons.push.apply( $rootScope.Modulelessons, $filter('orderBy')($scope.modules[i].lessons, 'sort_order') );
	    }
	});*/

	$scope.cutString = function(s, n){
		var cut= s.indexOf(' ', n);
		if(cut== -1) return s;
		return s.substring(0, cut)
	}

	$scope.excerpt = function( string ) {
		return $scope.cutString( string.replace(/(<([^>]+)>)/ig,""), 200 );
	}


	$scope.showFormat = function(format){
		$localStorage.syllabus_format = format;
		$scope.site.syllabus_format = format;
	}

	
	$scope.assignCounter= function ($ctr)
	{
		$rootScope.showCounter=parseInt($ctr);
	}

});
