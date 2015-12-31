var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.lessons",{
			url: "/lessons",
			templateUrl: "/templates/components/public/app/lessons/lessons.html",
			controller: "LessonsController"
		})
}); 

app.controller('LessonsController', function ($scope, smModal, $rootScope, $localStorage,  $state, $stateParams, $filter, Restangular, toastr,$location) {


    $scope.lesson_count = 0;
    $rootScope.page_title = 'Lessons';
    $scope.loading=true;
    $scope.syllabus = {edit_mode : false}
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
    $scope.addAccessLevel = function(data){
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
    }
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

    $scope.editLesson = function(lesson){
        smModal.Show('public.admin.site.content.syllabus.lesson' , {id : lesson.id , close:true} ,null , $scope.done);
        $scope.syllabus.current_action = 'edit_lesson';
        $scope.syllabus.current_item = lesson.id;
    }

    $scope.addLesson = function(){
        smModal.Show('public.admin.site.content.syllabus.lesson' , {close:true} ,null , $scope.done);
        $scope.syllabus.current_action = 'add_lesson';
    }

    $scope.addModule = function(){
        smModal.Show('public.admin.site.content.syllabus.module' , {close:true} ,null , $scope.done);
        $scope.syllabus.current_action = 'add_module';
    }

    $scope.editModule = function(module){
        smModal.Show('public.admin.site.content.syllabus.module' , {id : module.id , close:true} ,null , $scope.done);
        $scope.syllabus.current_action = 'edit_module';
    }

    $scope.editLessonDone = function(edited_lesson){
        $scope.addAccessLevel(edited_lesson);
        if(edited_lesson && edited_lesson.id){

            for (var i = $scope.modules.length - 1; i >= 0; i--) {
                for (var j = $scope.modules[i].lessons.length - 1; j >= 0; j--) {
                    if($scope.modules[i].lessons[j].id == edited_lesson.id){
                        edited_lesson.note = $scope.modules[i].lessons[j].note;
                        edited_lesson.access_level = $scope.modules[i].lessons[j].access_level;
                        $scope.modules[i].lessons[j] = edited_lesson;
                    }
                };
            };
        }
    }

    $scope.addLessonDone = function(added_lesson){
        $scope.addAccessLevel(added_lesson);
        if(added_lesson && added_lesson.id){
            for (var i = $scope.modules.length - 1; i >= 0; i--) {
                if(!$scope.modules[i].id){
                    $scope.modules[i].lessons.push(added_lesson);
                }
            };
        }
    }

    $scope.addModuleDone = function(added_module){
        if(added_module && added_module.id){
            added_module.show_me = true;
            $scope.modules.push(added_module);
        }
    }

    $scope.editModuleDone = function(edited_module){
        edited_module.show_me = true;
        if(edited_module && edited_module.id){

            for (var i = 0; i < $scope.modules.length; i++) {
                if($scope.modules[i].id == edited_module.id){
                    edited_module.lessons = $scope.modules[i].lessons;
                    $scope.modules[i] = edited_module;
                }
            };
        }
    }

    $scope.done = function(response){
        //alert('done')
        // $state.transitionTo($state.current, $stateParams, { 
        //   reload: true, inherit: false, location: false
        // });
        // return;
        smModal.Close();
        switch($scope.syllabus.current_action){
            case 'edit_lesson':
                $scope.editLessonDone(response);
                break;
            case 'add_lesson':
                $scope.addLessonDone(response);
                break; 
            case 'add_module':
                $scope.addModuleDone(response);
                break; 
            case 'edit_module':
                $scope.editModuleDone(response);
                break;
        }
    }
    
});