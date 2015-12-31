var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.lessons",{
			url: "/lessons",
			templateUrl: "/templates/components/public/app/lessons/lessons.html",
			controller: "LessonsController"
		})
}); 

app.controller('LessonsController', function ($scope, $rootScope, $localStorage,  $state, $stateParams, $filter, Restangular, toastr,$location) {


    $scope.lesson_count = 0;
    $rootScope.page_title = 'Lessons';
    $scope.loading=true;
    
    $scope.salesPage=window.location.hash.substr(1);
    

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

    Restangular.one('module', 'home').get().then(function(response){
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
    });

    $scope.toggleComplete = function(lesson){
        if (!lesson.user_note){
            Restangular.service('userNote')
                .post({complete: 1})
                .then(function(response){
                    lesson.user_note = response;
                });
                return;
        }

        Restangular.one('userNote',lesson.user_note.id)
            .put({complete: lesson.user_note.complete ? 0 : 1})
            .then(function(response){
                console.log(response);
                lesson.user_note.complete = !lesson.user_note.complete;
            });
        

    }


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