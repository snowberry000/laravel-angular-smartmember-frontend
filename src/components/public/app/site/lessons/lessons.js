var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site.lessons",{
			url: "/lessons",
			templateUrl: "/templates/components/public/app/site/lessons/lessons.html",
			controller: "LessonsController",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ui.sortable'
                        }
                    ]);
                }/*,
                $site: function(Restangular){
                    return Restangular.one('site','details').get();
                }*/

            }
		})
}); 

app.controller('LessonsController', function ($scope, smModal, $rootScope, $localStorage,  $state, $stateParams, $filter, Restangular, toastr,$location) {

    $scope.access_level_types = [
        { id: 4, name: 'Draft (admin-only)' },
        { id: 3, name: 'Members' },
        { id: 2, name: 'Locked' },
        { id: 1, name: 'Visitors' },
    ];

    $scope.lesson_count = 0;
    $rootScope.page_title = $rootScope.site.name+' - Lessons';
    $scope.loading=true;
    $scope.syllabus = {edit_mode : $rootScope.edit_mode}
    $scope.salesPage=window.location.hash.substr(1);
   

    $scope.toggleModule =function($module){
        $module.hide_module=!$module.hide_module;
    }

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
        $scope.copy_modules = $modules;

        if(!$scope.syllabus.edit_mode){
            $scope.modules = _.reject($scope.modules,function($mod){
                return $mod.lessons.length==0;
            });
        }
        
        $.each($scope.modules, function (key, data) {
            
            $default_syllabus_closed = _.find($scope.site.meta_data, function(obj){ return obj.key == 'default_syllabus_closed'; });
            if($default_syllabus_closed)
                data.hide_module = $default_syllabus_closed.value=='1' ? true : false;
            console.log("its asdsad " +data.hide_module);
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
    // $scope.saveSyllabus = function(){
    //     alert("changed");
    // };

    $scope.saveSyllabus = function () {
        $scope.toggle_lessons = true;
        var lessons = [];
        //alert("called");
        $.each($(".module_item"), function (key, module) {
            delete module.hide_module;
            $upLessons = $(module).find(".lesson_item");
            if($upLessons.length==0)
            {
                lessons.push({
                    "module": $(module).data("id"), "lesson": null
                });
            }
            $.each($upLessons, function (key, lesson) {
                if($(lesson).data("id"))
                    lessons.push({
                        "module": $(module).data("id"), "lesson": $(lesson).data("id")
                    });
            });
        });
        Restangular.all('module').customPOST(lessons, "syllabusSave").then(function (data) {
            toastr.success("Course Content saved");
        });

    }

    $scope.saveAccessLevel = function(lesson){
        if(lesson.access_level_type != 2){
            $scope.saveLesson(lesson);
        }else{
            $scope.editLessonDone(lesson);
        }
    }

    $scope.saveLesson = function(lesson){

        var lesson_copy = angular.copy(lesson);
        if(lesson.access_level_type == 2 && lesson.access_level_id ==0){
            return "Please choose an access level id"
        }
        delete lesson_copy.user_note;
        delete lesson_copy.showCounter;
        delete lesson_copy.show_content_publicly;
        delete lesson_copy.description;
        delete lesson_copy.prev_lesson;
        delete lesson_copy.next_lesson;
        delete lesson_copy.total_lessons;
        delete lesson_copy.access_level;
        delete lesson_copy.current_index;
        delete lesson_copy.module;
        delete lesson_copy.access;
        //$scope.loading = true;
        Restangular.all('lesson').customPUT(lesson_copy , lesson.id).then(function(response){
            $scope.editLessonDone(response);
        })
    }

    $scope.saveModule = function(module){
        var module_copy = angular.copy(module);
        delete module_copy.lessons;
        delete module_copy.show_me;
        delete module_copy.hide_module;
        Restangular.all('module').customPUT(module_copy , module.id).then(function(response){

        })
    }

    $scope.ModuleSortableOptions = {
        connectWith: ".connectModulePanels",
        handler: ".ibox-title",
        disabled: $scope.syllabus.edit_mode ? false : true,
        stop: function(e, ui) {
            $scope.saveSyllabus();
        }
    };

    $scope.LessonSortableOptions = {
        connectWith: ".connectLessons",
        disabled: $scope.syllabus.edit_mode ? false : true,
        stop: function(e, ui) {
            $scope.saveSyllabus();
        },
        // start: function(e,ui) {
        //     return false;
        // }
    };

    $scope.toggleComplete = function(lesson){
        if (!lesson.user_note){
            Restangular.service('userNote')
                .post({complete: 1 , site_id: $rootScope.site.id, lesson_id : lesson.id})
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

    $scope.toggleEditMode = function(){
        $rootScope.edit_mode = !$scope.syllabus.edit_mode;
        $state.go($state.current, {edit_mode : true}, { 
           reload: true, inherit: false, location: false
        });
    }

    $scope.editLesson = function(lesson){
        smModal.Show('public.app.admin.lesson' , {id : lesson.id , close:true} ,null , $scope.done);
        $scope.syllabus.current_action = 'edit_lesson';
        $scope.syllabus.current_item = lesson.id;
    }

    $scope.addLesson = function(){
        smModal.Show('public.app.admin.lesson' , {close:true} ,null , $scope.done);
        $scope.syllabus.current_action = 'add_lesson';
    }

    $scope.addModule = function(){
        smModal.Show('public.administrate.site.content.syllabus.module' , {close:true} ,null , $scope.done);
        $scope.syllabus.current_action = 'add_module';
    }

    $scope.editModule = function(module){
        smModal.Show('public.administrate.site.content.syllabus.module' , {id : module.id , close:true} ,null , $scope.done);
        $scope.syllabus.current_action = 'edit_module';
    }

    $scope.editLessonDone = function(edited_lesson){

        $scope.addAccessLevel(edited_lesson);
        if(edited_lesson && edited_lesson.id){
            //fix lessons module
            for (var i = $scope.modules.length - 1; i >= 0; i--) {
                for (var j = $scope.modules[i].lessons.length - 1; j >= 0; j--) {
                    if($scope.modules[i].lessons[j].id == edited_lesson.id){
                        $scope.modules[i].lessons.splice(j , 1);
                        // $state.reload();
                    }

                };
                if(!edited_lesson.module_id && !$scope.modules[i].id)
                {
                    $scope.modules[i].lessons.push(edited_lesson);
                }
                if($scope.modules[i].id == edited_lesson.module_id){
                    $scope.modules[i].lessons.push(edited_lesson);
                }
            };

            for (var i = $scope.modules.length - 1; i >= 0; i--) {
                for (var j = $scope.modules[i].lessons.length - 1; j >= 0; j--) {
                    if($scope.modules[i].lessons[j].id == edited_lesson.id){
                        edited_lesson.note = $scope.modules[i].lessons[j].note;
                        edited_lesson.access_level = $scope.modules[i].lessons[j].access_level;
                        $scope.modules[i].lessons[j] = edited_lesson;
                        // $state.reload();
                    }
                };
            };
        }

        for(var i=0;i<$scope.modules.length;i++)
        {   
            $rootScope.Modulelessons.push.apply( $rootScope.Modulelessons, $filter('orderBy')($scope.modules[i].lessons, 'sort_order') );
        }
        for(var i=0;i<$scope.modules.length;i++)
        {   
            $scope.modules[i].lessons = $filter('orderBy')($scope.modules[i].lessons, 'sort_order') ;
            if(!$scope.modules[i].id)
                console.log($scope.modules[i].lessons);
        }

    }

    $scope.addLessonDone = function(added_lesson){
        $scope.addAccessLevel(added_lesson);
        $scope.module_found = false;
        if(added_lesson && added_lesson.id){
            for (var i = $scope.modules.length - 1; i >= 0; i--) {
                if($scope.modules[i].id == added_lesson.module_id){
                    $scope.modules[i].lessons.push(added_lesson);
                    $scope.modules[i].show_me = true;
                    $scope.module_found = true;
                    break;
                }
            };
        }

        if($scope.module_found == false && $scope.copy_modules && $scope.copy_modules.length){
            var module = null;
            for (var i = $scope.copy_modules.length - 1; i >= 0; i--) {
                if($scope.copy_modules[i].id == added_lesson.module_id){
                    module = $scope.copy_modules[i];
                    $scope.module_found = true;
                    break;
                }
            };
            var index = $scope.copy_modules.indexOf(module);
            if(index >= 0){
                $scope.copy_modules[index].lessons.push(added_lesson);
                $scope.modules.push($scope.copy_modules[index]);
                //$scope.modules[0].lessons.push(added_lesson);
            }
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
        
// $state.reload();
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