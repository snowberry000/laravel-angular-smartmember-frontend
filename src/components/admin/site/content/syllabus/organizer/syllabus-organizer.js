var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.content.syllabus.organizer",{
			url: "/organizer",
			templateUrl: "/templates/components/admin/site/content/syllabus/organizer/syllabus-organizer.html",
			controller: "SyllabusOrganizerController",
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
app.controller("SyllabusOrganizerController", function ($scope, $rootScope , $localStorage, $site , $user, $location, $stateParams, $modal, Restangular, toastr, $filter) {
	$scope.open1 = function (next_item) {
        var modalInstance = $modal.open({
            size: 'lg',
            windowClass: 'lesson-modal-window',
            templateUrl: '/templates/components/admin/site/content/syllabus/lesson/lesson.html',
            controller: 'LessonEditModalInstanceCtrl',
            resolve: {
                next_item: function(){
                    return next_item;
                },
                $modules: function() {
                    return $scope.modules;
                },
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'summernote'
                        }
                    ]);
                },
                $site: function(){
                    return $site;
                },
                $user: function(){
                    return $user;
                },
                access_level_types: function(){
                    return $scope.access_level_types;
                },
                access_levels: function(){
                    return $scope.access_levels;
                }
            }
        });

        modalInstance.result.then(function(){
            next_item = $scope.accessLevel( next_item );
        })
    };

    $scope.open2 = function (module_item) {
        $scope.module_item=module_item;
        var modalInstance = $modal.open({
            size: 'lg',
            templateUrl: 'templates/modals/moduleModal.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                module_item: function () {
                    return module_item;
                }
            }
        });

        modalInstance.result.then(function(){
        })
        
    };

    $scope.updateModuleTitle=function(module_item,$name){
        var mod = {'title': $name};
        var pageMetaData = Restangular.all("siteMetaData");
        if( module_item.id ) {
            module.customPUT(mod, module_item.id).then(function () {
                for(var i=0;i<$scope.modules.length;i++)
                {
                    if($scope.modules[i].id==module_item.id)
                        $scope.modules[i].title=$name;
                }
                toastr.success("Module has been saved");
            });
        }
        else {
            pageMetaData.customPOST({"default_module_title": $name}, "saveSingleOption").then(function () {
                toastr.success("Default Module name is changed!");
                $scope.options['default_module_title']=$name;
            });
        }
    }

    $scope.loading = true;
    var module = Restangular.all("module");
    var lesson = Restangular.all("lesson");

    $scope.disableSortable={};
    $scope.disableSortable.value=false;

    $scope.ModuleSortableOptions = {
        connectWith: ".connectModulePanels",
        handler: ".ibox-title",
        stop: function(e, ui) {
            $scope.saveSyllabus();
        }
    };

    $scope.LessonSortableOptions = {
        connectWith: ".connectLessons",
        stop: function(e, ui) {
            $scope.saveSyllabus();
        }
    };

    $scope.items=['item1','item2','item3'];
    $scope.items2=['item21','item22','item23'];
    $scope.unassigned_lessons = {};
    $scope.modules = {};
    $scope.init = function () {
        console.log("asdasd");
        console.log($rootScope.site;);
        var details = $rootScope.site;
        console.log("details: ");
        console.log(details);
        console.log($site);
        if (details) {
            $.each(details.meta_data, function (key, data) {
                $scope.options[data.key] = data.value;
            });
        }
        $scope.access = [];
        Restangular.one('module', 'syllabus').get().then(function (response) {
            if (response) {
                response.modules.forEach(function(module){
                    module.isDripFeed = false;
                    module.dripfeed_settings = module.dripfeed;
                    module.lessons.forEach(function(lesson){
                        lesson = $scope.accessLevel(lesson);
                        lesson.isOpen = false;
                        lesson.isDripFeed = false;
                        lesson.dripfeed_settings = lesson.dripfeed;
                    })
                })
                $scope.loading = false;
                $scope.modules = response.modules;
                $scope.unassigned_lessons = response.unassigned_lessons;
                $scope.$broadcast('dataloaded');
            }
        });
        for (var i =  $scope.access_levels.length - 1; i >= 0; i--) {
            $scope.access.push({text : $scope.access_levels[i].name , value:$scope.access_levels[i].id});
        }
    };

    $scope.saveDripFeedModule = function(item, type)
    {
        delete item.isDripFeed;
        var dripfeed_settings = {duration: item.dripfeed_settings.duration, interval: item.dripfeed_settings.interval};

        if( item.id ) {
            module.customPUT({dripfeed_settings: dripfeed_settings}, item.id).then(function () {
                toastr.success("Success! Module saved");
            });
        }
    }

    $scope.saveDripFeedLesson = function(item, type)
    {
        if(!item.id){
            toastr.success("Please set the title first");
            return;
        }

        delete item.isDripFeed;
        delete item.site;

        var dripfeed_settings = {'duration': item.dripfeed_settings.duration, 'interval': item.dripfeed_settings.interval};
        lesson.customPUT({dripfeed_settings: dripfeed_settings, site_id : item.site_id , id:item.id}, item.id).then(function () {
            toastr.success("Success! Lesson saved");

        });
    }

    $scope.saveAccessLevel = function(item , module , type){
        if(!item.id && item.type!='module'){
            toastr.success("Please set the title first");
            return;
        }
        if(item.type=='module'){
            var lessons = [];
            console.log(item)
            for (var i = 0; i< item.lessons.length ; i++) {
                if($scope.selectedLessons.indexOf(item.lessons[i].id)>=0){
                    lessons.push(item.lessons[i].id)
                }
            };
            Restangular.all('lesson').customPUT({access_level_type : item.access_level_type , access_level_id : item.access_level_id , lessons : lessons},'bulkUpdate?module_id='+item.id).then(function(response){
                angular.forEach(item.lessons , function(value , key){
                    if(lessons.indexOf(value.id)>=0){
                        value.access_level_type = response.access_level_type;
                        value.access_level_id = response.access_level_id;
                        value = $scope.accessLevel(value);
                    }

                })
            })
            delete item.isOpen;
            //delete item.selected;
            return;
        }
        delete item.site;
        delete item.isOpen;
        lesson.customPUT({access_level_type : item.access_level_type , access_level_id : item.access_level_id , site_id : item.site_id , id:item.id} , item.id).then(function (response) {
            toastr.success("Success! Lesson saved");
        });
        item = $scope.accessLevel(item)
    }

    $scope.accessLevel = function(lesson){
        switch (lesson.access_level_type)
        {
            case 1:
                lesson.access = 'Public';
                break;
            case 2:
                lesson.access = 'Members';
                break;
            case 3:
                lesson.access = 'Members';
                break;
            case 4:
                lesson.access = 'Draft (private)';
                break;
        }
        return lesson;
    }

    $scope.deleteLesson = function (lesson_item , module) {

        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return lesson_item.id
                }
            }

        });

        modalInstance.result.then(function () {
            if(!lesson_item.id){
                if(module)
                    module.lessons = _.without(module.lessons , lesson_item);
                else
                    $scope.unassigned_lessons = _.without($scope.unassigned_lessons, lesson_item);
                return;
            }

            Restangular.one("lesson", lesson_item.id).remove().then(function () {
                if(module)
                    module.lessons = _.without(module.lessons , lesson_item);
                else
                    $scope.unassigned_lessons = _.without($scope.unassigned_lessons, lesson_item);
            });
        })

    };

    $scope.deleteModule = function (module_id) {

        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return module_id
                }
            }

        });
        modalInstance.result.then(function () {
            var moduleWithId = _.find($scope.modules, function (module) {
                return module.id === module_id;
            });
            var lessons = moduleWithId.lessons;
            console.log(lessons);

            Restangular.one("module", moduleWithId.id).remove().then(function () {
                $scope.modules = _.without($scope.modules, moduleWithId);
                //$scope.init();
                angular.forEach(lessons , function(value , key){
                    $scope.unassigned_lessons.push(value);
                })
            });
        })
    };



    $scope.saveSyllabus = function () {
        $scope.toggle_lessons = true;
        var lessons = [];
        //alert("called");
        $.each($(".module_item"), function (key, module) {
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
        module.customPOST(lessons, "syllabusSave").then(function (data) {
            toastr.success("Course Content saved");
        });

    }

    $scope.updateModule = function (module_item) {
        var mod = {'title': module_item.title};

        if( module_item.id ) {
            module.customPUT(mod, module_item.id).then(function () {
                toastr.success("Success! Module saved");
            });
        }
        else {
            $scope.options.default_module_title;
            pageMetaData.customPOST({"default_module_title": $scope.options.default_module_title}, "saveSingleOption").then(function () {
                toastr.success("Success! Module saved!");
            });
        }
    };
    $scope.updateLesson = function (lesson_item , module) {
        var less = {'title': lesson_item.title, 'note': lesson_item.note , site_id: $site.id , id:lesson_item.id};

        if(lesson_item.id){
            lesson.customPUT(less, lesson_item.id).then(function (response) {
                toastr.success("Success! Lesson saved");
            });
        }
        else{

            if(module)
                less.module_id = module.id;

            lesson.customPOST(less).then(function (response) {
                toastr.success("Success! New lesson is added");
                response.isOpen = false;
                response.isDripFeed = false;
                if(module)
                    module.lessons[lesson_item.count] = response;
                else
                    $scope.unassigned_lessons[lesson_item.count] = response;
                $scope.$broadcast('dataloaded');
                setTimeout($scope.saveSyllabus, 200);
            });


        }
    }
    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };
    $scope.addLesson = function (module_id, title) {
        var moduleWithId = _.find($scope.modules, function (module) {
            return module.id === module_id;
        });
        moduleWithId.selected = false;
        if (title == '')
        {
            toastr.error("Lesson title can not be empty");
            return;
        }
        var permalink = $filter('urlify')(title);
        var newLesson = {'module_id': module_id , site_id : $site.id, 'title': title, access_level_type: 4, permalink: permalink};

        if(!moduleWithId.lessons)
            moduleWithId.lessons = [];

        newLesson.sort_order = moduleWithId.lessons.length + 1;

        lesson.customPOST(newLesson).then(function(response){
            toastr.success("Success! New lesson is added");
            response.isOpen = false;
            response.isDripFeed = false;
            response = $scope.accessLevel(response);
            moduleWithId.lessons.push(response);
            moduleWithId.pending_lesson = '';
        });
    }
    $scope.addUnassignedLesson = function () {
        var newLesson = {'module_id': 0 , site_id: $site.id};
        $scope.unassigned_lessons.push({count :  $scope.unassigned_lessons.length , lesson : newLesson , isOpen : false, isDripFeed: false});

    }
    $scope.addModule = function () {

        swal({
            title: "Add Module!",
            text: "Enter Module Name:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Module name"
        }, function (inputValue) {
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("You need to write something!");
                return false
            }

            module.customPOST({title: inputValue}).then(function (response) {
                response.isDripFeed = false;
                $scope.modules.push(response);
                $scope.modules[$scope.modules.length-1].lessons=[];
                $scope.$broadcast('dataloaded');
                swal.close();
                toastr.success("Success! New module is added!");
            });

        });
    }
    $scope.updateCourseTitle = function (course_title) {
        pageMetaData.customPOST({"course_title": course_title}, "saveSingleOption");
    }

    $scope.dragControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope) {
            if(sourceItemHandleScope.itemScope.sortableScope.element[0].id!='12')
                return true;
            else
                return false;
        },

        itemMoved: function ($event) {console.log("moved"+$event.source.sortableScope);setTimeout($scope.saveSyllabus, 200);},//Do what you want},
        orderChanged: function($event) {console.log("orderchange"+$event);setTimeout($scope.saveSyllabus, 200);},//Do what you want},

        dragStart: function ($event) {
            $(window).mousemove(function (e) {
                var x = $(window).innerHeight(),
                    y = e.clientY,
                    scrollIncrement = 15,
                    noScrollZone = 300;

                if( typeof $('.as-sortable-dragging') != 'undefined' && typeof $('.as-sortable-dragging').offset() != 'undefined' ) {
                    if ( y > x/2 + noScrollZone ) {
                        window.scrollBy(0, scrollIncrement);
                    }
                    if (y < x/2 - noScrollZone ) {
                        window.scrollBy(0, -1 * scrollIncrement);
                    } else {

                    }
                }
            });
        },
        dragEnd: function ($event) {
            $(window).off();
        },
        containment: '#board'//optional param.
    };

    $scope.dragModuleControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope){
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        },
        itemMoved: function ($event) {console.log("moved"+$event.source.sortableScope);setTimeout($scope.saveSyllabus, 200);},//Do what you want},
        dragStart: function ($event) {
            $(window).mousemove(function (e) {
                var x = $(window).innerHeight(),
                    y = e.clientY,
                    scrollIncrement = 15,
                    noScrollZone = 300;

                if( typeof $('.as-sortable-dragging') != 'undefined' && typeof $('.as-sortable-dragging').offset() != 'undefined' ) {
                    if ( y > x/2 + noScrollZone ) {
                        window.scrollBy(0, scrollIncrement);
                    }
                    if (y < x/2 - noScrollZone ) {
                        window.scrollBy(0, -1 * scrollIncrement);
                    } else {

                    }
                }
            });
        },
        dragEnd: function ($event) {
            $(window).off();
        },
        orderChanged: function($event) {console.log("orderchange"+$event);setTimeout($scope.saveSyllabus, 200);},//Do what you want},
        containment: '#board'//optional param.
    };
    $scope.selectedLessons = [];

    $scope.moduleSelected = function(module){
        module.some_selected = module.selected;
        angular.forEach(module.lessons , function(value , key){
            value.selected = module.selected;
            if(module.selected)
                $scope.selectedLessons.push(value.id);
            else
                $scope.selectedLessons = _.without($scope.selectedLessons , value.id);
        });
    }

    $scope.lessonSelected = function(lesson , module){
        if(!lesson.selected){

            $scope.selectedLessons = _.without($scope.selectedLessons , lesson.id);
            module.selected = false;
            for (var i = module.lessons.length - 1; i >= 0; i--) {
                if($scope.selectedLessons.indexOf(module.lessons[i].id)>=0){
                    module.some_selected = true;
                    return;
                }
            };
            module.some_selected = false;

        }else{
            module.some_selected = true;
            $scope.selectedLessons.push(lesson.id);
            for (var i = module.lessons.length - 1; i >= 0; i--) {
                if($scope.selectedLessons.indexOf(module.lessons[i].id)<0){
                    module.selected = false;
                    return;
                }
            };
            module.selected = true;
        }
        console.log($scope.selectedLessons)
    }

    $scope.setRedirectUrl = function(){
        $rootScope.syllabus_redirect_url = 'admin.site-content.syllabus';
    }
});

app.controller('LessonEditModalInstanceCtrl', function ($scope, $rootScope, $localStorage, $timeout ,  $state, next_item, access_level_types, access_levels , $location, $stateParams,$modal,$site , $modalInstance, $user , $filter, Restangular, toastr, $modules,Upload) {
    $scope.template_data = {
        title: 'Lesson',
        use_cancel_method: true
    }

    $scope.access_level_types = access_level_types;
    $scope.access_levels = access_levels;

    $scope.original_item = angular.copy( next_item );

    var interval ;
    var draft;
    var changed;
    $scope.func= function ()
    {
        var modalInstance = $modal.open({
            templateUrl: 'templates/modals/moduleCreator.html',
            controller: "modalController",
            scope: $scope
        });
        modalInstance.result.then(function () {
            alert("result called");
        })
    }

    if($location.search().clone){
        delete next_item.id;
        delete next_item.author_id;
        delete next_item.access;
    }


    if($modules.length>0)
        $scope.modules=$modules.items;
    else
        $scope.modules=null;
    $scope.newModule={};

    $scope.next_item = next_item;

    $scope.next_item.dripfeed_settings = next_item.dripfeed || {};
    if ($scope.next_item.published_date)
    {
        $scope.next_item.published_date = new Date(moment($scope.next_item.published_date).format('l'));
    } else {
        $scope.next_item.published_date = new Date();
        $scope.next_item.published_date.setSeconds(0);
        $scope.next_item.published_date.setMilliseconds(0);
    }
    if ($scope.next_item.end_published_date)
        $scope.next_item.end_published_date = new Date(moment($scope.next_item.end_published_date).format('l'));
    else
        $scope.next_item.end_published_date = null;

    $scope.next_item.discussion_settings = next_item.discussion_settings || {};
    $scope.next_item.id ? $scope.page_title = 'Edit lesson' : $scope.page_title = 'Create lesson';
    $scope.next_item.transcript_content_public == 1 ? $scope.next_item.transcript_content_public = true : $scope.next_item.transcript_content_public = false;
    $scope.next_item.access_level_type = parseInt( $scope.next_item.access_level_type );
    $scope.next_item.access_level_id = parseInt( $scope.next_item.access_level_id );

    if( $scope.next_item.access_level_type == 3 )
        $scope.next_item.access_level_type = 2;

    var seo = {};
    if (next_item.seo_settings) {
        $.each(next_item.seo_settings, function (key, data) {
            seo[data.meta_key] = data.meta_value;

        });
    }
    $scope.next_item.seo_settings = seo;
    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };

    $scope.changeModule = function($mod)
    {
        for(var i=0;i<$modules.items.length;i++)
        {
            if($modules.items[i].title==$mod)
            {
                $scope.next_item.module_id=$modules.items[i].id;
                break;
            }
        }
    }

    $scope.setPermalink = function ($event) {
        if(!$scope.next_item.permalink)
            $scope.next_item.permalink = $filter('urlify')($scope.next_item.title);
        $scope.next_item.seo_settings.fb_share_title = $scope.next_item.title;
    }

    $scope.setPermalink();

    $scope.onBlurSlug = function ($event) {
        if ($scope.next_item.permalink)
            $scope.next_item.permalink = $filter('urlify')($scope.next_item.permalink);
    }

    $scope.saveModule = function ($model) {
        Restangular.all('module').post($model).then(function (module) {
            if($scope.modules)
                $scope.modules.push(module);
            else
            {
                $scope.modules=[];
                $scope.modules.push(module);
            }
            toastr.success("Module has been saved");
            $scope.isOpen = false;
        });
    }
    $scope.getFileName=function($url)
    {
        if($url){
            str = $url.split("/");
            if (str) {
                str = str[str.length-1];
                tkns = str.split(".")
                if (tkns.length > 0)
                    tkns.splice(0, 1);

                return tkns.join('.');
            }
        }
    }

    $scope.save = function () {
        delete $scope.next_item.prev_lesson;
        delete $scope.next_item.next_lesson;
        delete $scope.next_item.total_lessons;
        delete $scope.next_item.access_level;
        delete $scope.next_item.current_index;
        delete $scope.next_item.module;
        delete $scope.next_item.site;
        delete $scope.next_item.isOpen;
        delete $scope.next_item.isDripFeed;


        $scope.next_item.title=$scope.next_item.title.trim();

        if( $scope.next_item.permalink == '' )
            this.setPermalink(null);

        $scope.next_item.permalink=$scope.next_item.permalink.trim();
        $callback = "";

        if( $scope.next_item.access_level_type == 2 && $scope.next_item.access_level_id == 0 )
            $scope.next_item.access_level_type = 3;

        if($scope.next_item.access_level_type!=2)
            $scope.next_item.access_level_id = 0;
        if ($scope.next_item.id) {
            $callback = Restangular.all('lesson').customPUT($scope.next_item, $scope.next_item.id);
        }else {
            $callback = Restangular.all('lesson').post($scope.next_item);
        }

        $callback.then(function(lesson){
            $scope.next_item = lesson;
            toastr.success("Lesson has been saved");

        })

        $modalInstance.close();
    }

    $scope.cancel = function () {
        angular.forEach( $scope.next_item, function(value,key){
            $scope.next_item[key] = $scope.original_item[key];
        });
        $modalInstance.dismiss('cancel');
    };
});