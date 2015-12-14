app.controller('adminSupportTicketCreateController', function ($scope, $localStorage,$rootScope, $state, Restangular, toastr) {
    $scope.ticket={};
    $scope.agents=[];
    $scope.sites=null;
    $scope.searched_users=[];

    Restangular.all('role').customGET('agents').then(function(response){
        $scope.agents=response;
    });

    Restangular.one('supportTicket').customGET('sites').then(function(response){
        $scope.sites = response.sites;
        $scope.ticket.company_id=response.company_id;
    });

    $scope.getFileName=function($fileName){
        if($fileName)
        {
            $splitted=$fileName.split('/');
            return $splitted[$splitted.length-1];
        }
        else
            return "";
        
    }

    $scope.search_users = function(search){
        if(!search)
            return;
        Restangular.all("").customGET("role",{site_id : $scope.ticket.site_id , q : search , count :10 }).then(function(response){
            if(response.items.length==0){
                //$scope.searched_users = [{email : search , fisrt_name : 'New User'}]
                $scope.searched_users = _.pluck(response.items , 'user');
                console.log("searchedusers: "+$scope.searched_users);
            }
            else
            {
                $scope.searched_users = _.pluck(response.items , 'user');
                console.log("searchedusers: "+$scope.searched_users);
            }
        });
    }

    $scope.save=function()
    {
        var ticket = angular.copy($scope.ticket);
        ticket.user_id=ticket.user_email.id;
        ticket.user_email=ticket.user_email.email;
        Restangular.all('supportTicket').post(ticket).then(function (response) {
            toastr.success("Ticket Created successfully!");
            $state.go("admin.team.helpdesk.tickets");
        });
    }

});

app.controller('adminSupportController', function ($scope, $modal,$localStorage, $state, $stateParams, $site, $filter, Restangular, toastr ) {
    $scope.template_data = {
        title: 'HELPDESK_ARTICLES',
        description: 'Create a knowledgebase for your members to help answer their most frequently asked questions.',
        singular: 'helpdesk article',
        edit_route: 'admin.site.content.helpdesk.article',
        api_object: 'supportArticle'
    }

    $scope.data = [];
    $scope.pagination = {current_page: 1};
    $scope.pagination.total_count = 1;

    $scope.paginate = function(){

        if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page, site_id: $site.id};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
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
        var $params = { site_id :$site.id , p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
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

app.controller('supportController', function ($scope,$rootScope, $localStorage, $state, $stateParams, $site, $filter, Restangular, toastr ) {
    $rootScope.page_title = 'Support';
    $scope.init = function(){
        Restangular.all('supportCategory').getList({public_view:true}).then(function(response){
            $scope.categories = response;

        })
    }


    $scope.search = function(){
        $scope.searchResults = [];
        for (var i =  0 ; i < $scope.categories.length ; i++) {
            var category = $scope.categories[i];
            for (var j = 0 ; j < category.articles.length; j++) {
                var article = category.articles[j];
                if(article.content.indexOf($scope.searchquery) > -1 || article.title.indexOf($scope.searchquery) > -1)
                    $scope.searchResults.push(article);
            };
        };
    }

    $scope.showFormat = function(format){
        $localStorage.syllabus_format = format;
        $scope.site.syllabus_format = format;
    }
});


app.controller('adminSupportArticleController', function ($scope,Upload, $location, $timeout , $user , $modal, $localStorage, $state, $article,$stateParams, $site, $filter, Restangular, toastr ) {
    //$scope.page = $page;
    var draft;
    var changed;
    if($location.search().clone){
        delete $article.id;
        delete $article.access;
        delete $article.author_id;
    }
    $scope.article = $article;
    $scope.article.id ? $scope.page_title = 'Edit article' : $scope.page_title = 'Create article';
    $scope.categories = [];

    Restangular.all('supportCategory').getList({public_list:true,category_list:true}).then(function(response){
        $scope.categories = response;
        
    });


    $scope.openCategoryModel = function () {
        var modalInstance = $modal.open({
            size: 'lg',
            templateUrl: 'templates/modals/create_category.html',
            controller: "modalController",
            scope: $scope
        });

        modalInstance.result.then(function(){

        })
    };

    $scope.saveCategory = function($model)
    {
        $model.company_id=$site.company_id;
        Restangular.all('supportCategory').post($model).then(function(response){
            $scope.categories.push(response);
            toastr.success("Support category added successfully!");
        });
    }

    $scope.imageUpload = function(files){

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
                url: $scope.app.apiUrl + '/utility/upload',
                file: file
            })
                .success(function (data, status, headers, config) {
                    console.log(data.file_name);
                    var editor = $.summernote.eventHandler.getModule();
                    file_location = '/uploads/'+data.file_name;
                    editor.insertImage($scope.editable, data.file_name);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
        }
    }

    


    $scope.init = function(){
        if($stateParams.article_id){
            Restangular.one('supportArticle',$stateParams.article_id).get().then(function(response){
                $scope.article = response;
            })
        }

    }

    $scope.save = function(){
        if( $scope.article.permalink == '' )
            this.onBlurTitle(null);

        if ($scope.article.permalink == '' || $scope.article.permalink == undefined)
        {   
            toastr.error("Article permalink can not be empty.");
            return;
        }

        if($scope.article.id){
            $scope.article.put();
            toastr.success("Support article edited successfully!");
            $state.go("admin.site.content.helpdesk.articles");
        }
        else{
            Restangular.all('supportArticle').post($scope.article).then(function(response){
                if(draft)
                    Restangular.one('draft' , draft.id).remove();
                toastr.success("Support article added successfully!");
                $state.go("admin.site.content.helpdesk.articles");
            })
        }
    }

    $scope.onBlurTitle = function ($event) {
        if (!$scope.article.permalink)
            $scope.article.permalink = $filter('urlify')($scope.article.title);
    }
    $scope.onBlurSlug = function ($event) {
        if ($scope.article.permalink)
            $scope.article.permalink = $filter('urlify')($scope.article.permalink);
    }
    //disabling for now because this isn't the draft feature we wanted
    if(false && !$stateParams.id && !$location.search().clone)
    Restangular.all('draft').customGET('', {site_id : $site.id , user_id : $user.id , key : 'articles.content'}).then(function(response){
        if(response.length){
            draft = response[0]
            $scope.loadDraft()
        }
    })
    $scope.loadDraft = function(){
        var value = JSON.parse(draft.value);
        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/loadDraft.html',
            controller: "modalController",
            scope: $scope,

        });
        modalInstance.result.then(function () {
            $scope.article = value;
        } , 
        function () {
          Restangular.one('draft' , draft.id).remove().then(function(res)
            {
                draft=null;
            });
        })
    }

    var timeout = null;
    $scope.$watch('article' , function(article , oldArticle){
        if(typeof changed == "undefined")
            changed = false;
        else
            changed = true;
        if (article != oldArticle && changed && !$scope.article.id && !$location.search().clone) {
              if (timeout) {
                $timeout.cancel(timeout)
              }
              timeout = $timeout($scope.start, 3000);  // 1000 = 1 second
            }
    } , true)

    $scope.start = function(){
        var data = {site_id : $site.id , user_id : $user.id , key : 'articles.content' , value : JSON.stringify($scope.article)}
        Restangular.all('draft').post(data).then(function(response){
            console.log(response);
            draft=response;
        })
    }

});

app.controller('supportArticleController', function ($scope, $rootScope , $localStorage, $state, $stateParams,$filter, Restangular, toastr ) {
    //$scope.page = $page;
    $scope.loading=true;

    
    Restangular.one('articleByPermalink', $stateParams.permalink).get().then(function(response){
        $article=response;
        $scope.loading=false;
        $scope.article = $article;
        $scope.next_item = $scope.article;
        $rootScope.page_title = $article.title || $rootScope.page_title;
    });
});

app.controller('adminSupportTicketController', function ($scope, $localStorage,$site, $state, $stateParams,$modal, $tickets,$agents, $filter, Restangular, $user,toastr ) {
    //$scope.page = $page;
    $scope.tickets = $tickets;
    $scope.agents = $agents;
    $scope.ticket = {company_id : $site.company_id};
    $scope.current_user_id = $user.id;
    $scope.currentPage = 1;
    $scope.loadMore = function(){
        $scope.disable = true;
        Restangular.all('supportTicket').getList({p:++$scope.currentPage , company_id :$site.company_id}).then(function (tickets) {
            $scope.tickets = $scope.tickets.concat(tickets);
            if(tickets.length>0)
                $scope.disable = false;
        });
    }

    $scope.openModal = function(){
        alert("here");
        var modalInstance = $modal.open({
            templateUrl: '/templates/admin/other/modals/ticket_modal.html',
            controller: "modalController",
            scope: $scope
        });
        modalInstance.result.then(function () {
            $scope.ticket.user_id=$scope.current_user_id ;
            Restangular.all('supportTicket').post($scope.ticket).then(function (response) {
                response.user = $scope.ticket.user_name;
                response.status = 'Open';
                $scope.tickets.push(response)
                $scope.ticket = {company_id : $site.company_id};
            });
        })
    }  
});

app.controller('adminSupportTicketEditController', function ($scope, $localStorage, $state, $stateParams, $ticket,$user, $filter, Restangular, toastr ) {
    $scope.ticket = $ticket.ticket;
    $scope.current_user_id = $user.id;
    $scope.agents = [];

    Restangular.service('role/agents').getList().then(function(data){

        angular.forEach(data, function(value){
            if( typeof value.user != 'undefined' ) {
                var user_name = value.user.first_name + ' ' + value.user.last_name;
                var name_bits = user_name.split(' ');
                var initials = '';
                if( name_bits.length > 1)
                    initials = name_bits[0].charAt(0).toUpperCase() + name_bits[1].charAt(0).toUpperCase();
                else
                    initials = name_bits[0].charAt(0).toUpperCase() + name_bits[0].charAt(1).toUpperCase();

                $scope.agents.push({
                    id: value.user.id,
                    name: user_name,
                    email:value.user.email,
                    profile_image: value.user.profile_image,
                    initials: initials
                });
            }
        });

        var isAgent = _.find($scope.agents , {'id':$user.id}) || _.find($scope.agents , {'id':$user.id + ''});
        console.log($scope.agents)
        if(isAgent){
            $scope.display_replies = $scope.ticket.reply.concat($scope.ticket.notes)
            $scope.display_replies = $scope.display_replies.concat( $scope.ticket.actions );
            $scope.display_replies = _.sortBy($scope.display_replies, 'created_at');

            angular.forEach( $scope.display_replies, function( value, key ) {
                console.log( key, ' => ', $scope.formatDate( value.created_at ) );
            });

        } else {
            $scope.display_replies = $scope.ticket.reply.concat( $scope.ticket.actions );
            _.sortBy($scope.display_replies, 'created_at');
        }
    });

    $scope.isImage = function( file ) {
        return ['jpg','jpeg','png','gif','bmp'].indexOf( file.split('/').pop().split('.').pop().toLowerCase() ) != -1;
    }

    $scope.linkify = function(inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        return replacedText;
    }

    $scope.userActionMessage = function(action){
        var message = '';
        if( action.user.first_name || action.user.last_name )
            message += action.user.first_name + ' ' + action.user.last_name;
        else
            message += action.user.email;

        switch( action.modified_attribute )
        {
            case 'status':
                message += ' changed ticket status from ' + _.findWhere( $scope.statuses, {id: action.old_value} ).value + ' to <strong>' + _.findWhere( $scope.statuses, {id: action.new_value} ).value + '</strong>';
                break;
            case 'agent_id':
                var agent = _.find($scope.agents , {'id':action.new_value}) || _.find($scope.agents , {'id':action.new_value + ''});
                message += ' assigned ticket to <strong>' + ( agent ? agent.name : action.new_value ) + '</strong>';
                break;
            case 'rating_requested':
                message = '<strong>' + ( $scope.ticket.user.first_name || $scope.ticket.user.last_name ? $scope.ticket.user.first_name + ' ' + $scope.ticket.user.last_name : $scope.ticket.user.email ) + '</strong> was asked to rate the customer service';
                break;
            case '3_day':
                message = 'Auto follow-up sent to ' + '<strong>' + ( $scope.ticket.user.first_name || $scope.ticket.user.last_name ? $scope.ticket.user.first_name + ' ' + $scope.ticket.user.last_name : $scope.ticket.user.email ) + '</strong> after 3 days without a reply';
                break;
            case '5_day':
                message = 'Notice of ticket being closed sent to ' + '<strong>' + ( $scope.ticket.user.first_name || $scope.ticket.user.last_name ? $scope.ticket.user.first_name + ' ' + $scope.ticket.user.last_name : $scope.ticket.user.email ) + '</strong> after 5 days without a reply';
                break;
        }

        return message;
    }

    $scope.autoActionMessage = function(action){
        switch( action.modified_attribute )
        {
            case 'status':
                message = 'Ticket status changed from ' + _.findWhere( $scope.statuses, {id: action.old_value} ).value + ' to <strong>' + _.findWhere( $scope.statuses, {id: action.new_value} ).value + '</strong>';
                break;
            case 'agent_id':
                var agent = _.find($scope.agents , {'id':action.new_value}) || _.find($scope.agents , {'id':action.new_value + ''});
                message = 'Ticket assigned to <strong>' + ( agent ? agent.name : action.new_value ) + '</strong>';
                break;
            case 'rating_requested':
                message = '<strong>' + ( $scope.ticket.user.first_name || $scope.ticket.user.last_name ? $scope.ticket.user.first_name + ' ' + $scope.ticket.user.last_name : $scope.ticket.user.email ) + '</strong> was asked to rate the customer service';
                break;
            case '3_day':
                message = 'Auto follow-up sent to ' + '<strong>' + ( $scope.ticket.user.first_name || $scope.ticket.user.last_name ? $scope.ticket.user.first_name + ' ' + $scope.ticket.user.last_name : $scope.ticket.user.email ) + '</strong> after 3 days without a reply';
                break;
            case '5_day':
                message = 'Notice of ticket being closed sent to ' + '<strong>' + ( $scope.ticket.user.first_name || $scope.ticket.user.last_name ? $scope.ticket.user.first_name + ' ' + $scope.ticket.user.last_name : $scope.ticket.user.email ) + '</strong> after 5 days without a reply';
                break;
        }

        return message;
    }

    $scope.actionMessage = function(action){
        if( action.user )
            return $scope.userActionMessage( action );
        else
            return $scope.autoActionMessage( action );
    }

    $scope.autop = function(stringValue) {
        if( typeof stringValue != 'undefined' ) {
            var string_bits = stringValue.split('\n');
            return '<p>' + string_bits.join('</p><p>') + '</p>';
        }
        else
            return stringValue;
    }

    $scope.changeStatus=function()
    {
        if ($scope.ticket.status == 'open')
        {
            $scope.ticket.status = 'pending';
        }
        if ($scope.ticket.agent_id == 0)
        {
            $scope.ticket.agent_id = $user.id;
            $scope.ticket.agent=$user;
        }
    }

    $scope.formatDate = function(inputDate) {
        var input = new Date( inputDate );
        var timeNow = new Date( Date.now() );
        var today = timeNow.getDay();
        var thenDay = input.getDay();

        if( today == thenDay ) {
            return 'Today';
        } else if( today - 1 == thenDay ) {
            return 'Yesterday';
        } else {
            return moment( inputDate).format('MMMM Do');
        }
    }

    $scope.advanced_info = $ticket.advanced_info;
    $scope.recent_tickets = $ticket.recent_tickets;
    $scope.statuses = [
        {value : "Open" , id: "open" },
        {value :  "Pending", id: "pending"},
        {value : "Solved" , id: "solved"},
        {value : "Spam" , id: "spam"},
    ]


    $scope.reply = {parent_id : $scope.ticket.id , company_id : $scope.ticket.company_id};
    $scope.send_email = false;
    $scope.sendReply = function()
    {
        if($scope.admin_mode){
            Restangular.all('adminNote').post({ticket_id : $scope.ticket.id , note : $scope.reply.message}).then(function (response) {
                toastr.success("Your note has been saved");
                response.user = $user;
                $scope.ticket.notes.push(response);
                $scope.display_replies.push(response)
                $scope.reply = {parent_id : $scope.ticket.id , company_id : $scope.ticket.company_id};
            });
        }
        else{

            if( $scope.ticket.agent_id == 0) {
                $scope.ticket.agent_id = $scope.current_user_id;
                $scope.agentChange();
            }

            if( typeof $scope.reply.message != 'undefined' && $scope.reply.message != '' ) {
                $scope.send_email = $scope.change_ticket_status == $scope.ticket.status;
                $scope.reply.send_email = $scope.send_email;
                Restangular.all('supportTicket').post($scope.reply).then(function (response) {
                    toastr.success("A reply has been created.");
                    $scope.reply.message = '';
                    $scope.ticket.reply.push(response);
                    $scope.display_replies.push(response);
                    $scope.reply = {parent_id : $scope.ticket.id , company_id : $scope.ticket.company_id};
                    $scope.send_email = !$scope.send_email;
                    $scope.statusChange();
                });
            }else{
                $scope.statusChange();
            }
        }
    }

    $scope.statusChange = function()
    {
        if( $scope.change_ticket_status != $scope.ticket.status ) {
            //$scope.send_email = $scope.change_ticket_status != $scope.ticket.status;
            $scope.previous_ticket_status = $scope.ticket.status;
            $scope.ticket.status = $scope.change_ticket_status;
            Restangular.one('supportTicket', $scope.ticket.id).put({
                'status': $scope.ticket.status,
                'read': 1,
                'send_email' : $scope.send_email
            }).then(function (response) {
                toastr.success("Ticket status changed!");

                var action = {
                    modified_attribute: 'status',
                    user: $user,
                    new_value: $scope.ticket.status,
                    old_value: $scope.previous_ticket_status,
                    created_at: response.created_at
                };

                $scope.display_replies.push( action );
            })
            $scope.send_email = false;
        }
    }

    $scope.agentChange = function()
    {
        Restangular.one('supportTicket' , $scope.ticket.id).put({'agent_id':$scope.ticket.agent_id}).then(function(response){
            toastr.success("Agent updated");
            $scope.ticket.agent = response.agent;
            $scope.change_agent=false;
            var action = {
                modified_attribute: 'agent_id',
                user: $user,
                new_value: $scope.ticket.agent_id,
                created_at: response.created_at
            };

            $scope.display_replies.push( action );
        })
    }

    $scope.setCannedResponse = function(content){
        $scope.reply.message = content;
    }

    $scope.assignToSMTech = function(){
        Restangular.one('supportTicket', $scope.ticket.id).put({
            'company_id': 10372,
            'agent_id': 2
        }).then(function (response) {
            $scope.ticket.agent_id = 2;
            $scope.ticket.company_id = 10372;
            $scope.ticket.sm_tech = true;
            toastr.success("Ticket assigned to SM Tech team");
        })
    }
});


app.controller('adminSupportCategoriesController', function ($scope,$site, $modal,$localStorage, $state, $stateParams,$filter, Restangular, toastr ) {
    $scope.template_data = {
        title: 'HELPDESK_CATEGORIES',
        description: 'Group helpdesk articles together into categories to help organize your knowledgebase.',
        singular: 'helpdesk category',
        edit_route: 'admin.site.content.helpdesk.category',
        api_object: 'supportCategory'
    }

    $scope.data = [];
    $scope.pagination = {current_page: 1};
    $scope.pagination.total_count = 1;

    $scope.paginate = function(){

        if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page, site_id: $site.id};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
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
        var $params = { site_id :$site.id , p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
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

app.controller('adminSupportCategoryController', function ($scope, $localStorage, $state,$category, $stateParams, $site, $filter, Restangular, toastr ) {
    //$scope.page = $page;
    $scope.category = $category;
    $scope.category.id ? $scope.page_title = 'Edit category' : $scope.page_title = 'Create category';


    $scope.save = function(){
        if($scope.category.id){
            $scope.category.put();
            toastr.success("Support category edited successfully!");
            $state.go("admin.site.content.helpdesk.categories");
        }
        else{
            Restangular.all('supportCategory').post($scope.category).then(function(response){
                toastr.success("Support category added successfully!");
                $state.go("admin.site.content.helpdesk.categories");
            })
        }
    }

});

app.controller('supportTicketController', function ($scope,Upload,$site, $localStorage, $state, $stateParams,$filter, Restangular, toastr ) {
    $scope.ticket = {};
    $scope.init = function(){
        $scope.ticket.type = $stateParams.type || 'normal';
        $scope.ticket.company_id = $site.company_id;
    }

    $scope.imageUpload = function(files){

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
                url: $scope.app.apiUrl + '/utility/upload',
                file: file
            })
                .success(function (data, status, headers, config) {
                    console.log(data.file_name);
                    var editor = $.summernote.eventHandler.getModule();
                    file_location = '/uploads/'+data.file_name;
                    editor.insertImage($scope.editable, data.file_name);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
        }
    }

    $scope.validateEmail = function(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    $scope.save = function(){

        var message_verified = true;
        if (!$scope.isLoggedIn())
        {
            if (!$scope.validateEmail($scope.ticket.user_email))
            {
                toastr.error("Email is not valid. Please check email again");
                message_verified = false;
            }
        }
        if( typeof $scope.ticket.message == 'undefined' || $scope.ticket.message == '' ) {
            toastr.error("You must add a message to submit a ticket!");
            message_verified = false;
        }

        if( typeof $scope.ticket.subject == 'undefined' || $scope.ticket.subject == '' ) {
            toastr.error("You must add a subject to submit a ticket");
            message_verified = false;
        }

        if( message_verified == true ) {
            Restangular.all('supportTicket').post($scope.ticket).then(function (response) {
                toastr.success("Your ticket has been created.");
                $scope.ticket_submitted = true;
            })
        }
    }
});

app.controller('supportTicketsController', function ($scope,$site,$localStorage, $state, $stateParams,$filter, Restangular, toastr ) {
    $scope.loading=true;
    Restangular.all('supportTicket').customGET('userTickets').then(function(response){
        $scope.loading=false;
        $tickets=response;
        $scope.tickets = $tickets;
    });
    
});

app.controller('supportTicketEditController', function ($scope,$site,$localStorage, $state, $stateParams,$filter, Restangular, toastr ) {
    $scope.loading=true;
    Restangular.one('supportTicket' , $stateParams.id).get().then(function(response){
        $scope.loading=false;
        $ticket=response;
        $scope.ticket = $ticket.ticket;
        $scope.reply = {parent_id : $scope.ticket.id , company_id : $scope.ticket.company_id};
    });

    $scope.statuses = [
        {value : "Open" , id: "open" },
        {value : "Pending" , id: "pending"},
        {value : "Solved" , id: "solved"},
        {value : "Spam" , id: "spam"},
    ]

    $scope.autop = function(stringValue) {
        if( typeof stringValue != 'undefined' ) {
            var string_bits = stringValue.split('\n');
            return '<p>' + string_bits.join('</p><p>') + '</p>';
        }
        else
            return stringValue;
    }

    $scope.sendReply = function(status)
    {
        if( typeof status == 'undefined' || status == null || status == '' )
            status = 'open';

        $scope.ticket.status = status;
        $scope.statusChange();

        Restangular.all('supportTicket').post($scope.reply).then(function(response){
            toastr.success("A reply has been created.");
            $scope.reply.message = '';
            $scope.ticket.reply.push(response);
        })
    }

     $scope.statusChange = function()
    {
        Restangular.one('supportTicket' , $scope.ticket.id).put({'status':$scope.ticket.status}).then(function(response){

        })
    }

    $scope.linkify = function(inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        return replacedText;
    }
});


app.controller('adminSupportCreatorController', function ($scope,$site,$modal, $localStorage, $state, $stateParams,$filter, Restangular, toastr ) {
    var category = Restangular.all("supportCategory");
    var article = Restangular.all("supportArticle");
    var pageMetaData = Restangular.all("siteMetaData");

    $scope.unassigned_articles = [];
    $scope.categories = [];

    $scope.init = function(){
        var details = $site;
        if (details) {
            $.each(details.meta_data, function (key, data) {
                $scope.options[data.key] = data.value;
            });
        }
        Restangular.all('supportCategory').getList({company_id:$site.company_id}).then(function (response) {
            if (response) {
                $scope.categories = response;
                $scope.categories = $filter('orderBy')($scope.categories, 'sort_order');
                for(var i=0;i<$scope.categories.length;i++)
                {
                    $scope.categories[i].articles=$filter('orderBy')($scope.categories[i].articles, 'sort_order');
                }
                $scope.$broadcast('dataloaded');
            }
        });

        Restangular.all('supportArticle').getList({company_id:$site.company_id , category_id:0}).then(function (response) {
            if (response) {
                $scope.unassigned_articles = response;
                $scope.unassigned_articles = $filter('orderBy')($scope.unassigned_articles, 'sort_order');
                $scope.$broadcast('dataloaded');
            }
        });
    }

    $scope.deleteArticle = function (article_item , category) {

        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return article_item.id
                }
            }

        });
    
        modalInstance.result.then(function () {
            if(!article_item.id){
                if(category)
                    category.articles = _.without(category.articles , article_item);
                else
                    $scope.unassigned_articles = _.without($scope.unassigned_articles, article_item);
                return;
            }

            Restangular.one("supportArticle", article_item.id).remove().then(function () {
                if(category)
                    category.articles = _.without(category.articles , article_item);
                else
                    $scope.unassigned_articles = _.without($scope.unassigned_articles, article_item);
            });
        })
    };

    $scope.deleteCategory = function (category_id) {

        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return category_id
                }
            }

        });
        modalInstance.result.then(function () {
            var categoryWithId = _.find($scope.categories, function (category) {
                return category.id === category_id;
            });
            var articles = categoryWithId.articles;
            Restangular.one("supportCategory", categoryWithId.id).remove().then(function () {
                $scope.categories = _.without($scope.categories, categoryWithId);
                angular.forEach(articles , function(value , key){
                    $scope.unassigned_articles.push(value);
                })
            });
        })
    };

    $scope.updateCategory = function (category_item) {
        var mod = {'title': category_item.title};

        if( category_item.id ) {
            category.customPUT(mod, category_item.id).then(function () {
                toastr.success("Success! category saved");
            });
        }
        else {
            pageMetaData.customPOST({"default_support_category_title": $scope.options.default_support_category_title}, "saveSingleOption").then(function () {
                
                toastr.success("Success! Category saved");
            });
        }
    };

    $scope.addCategory = function (newItem) {
        category.post({company_id:$site.company_id}).then(function (response) {
            $scope.categories.push(response);
            $scope.$broadcast('dataloaded');
            toastr.success("Success! New category is added");
        });
    }

    $scope.addArticle = function (category_id) {
    
       var categoryWithId = _.find($scope.categories, function (category) {
            return category.id === category_id;
        });
        var newArticle = {'category_id': category_id , 'company_id':$site.company_id};
        if(!categoryWithId.articles)
           categoryWithId.articles = [];
        categoryWithId.articles.push({count :categoryWithId.articles.length , article : newArticle });  
        //toastr("Your article is added!");

    }

    $scope.addUnassignedArticle = function () {
        var newArticle = {'category_id': 0 , 'company_id':$site.company_id};
        $scope.unassigned_articles.push({count :  $scope.unassigned_articles.length , article : newArticle }); 
    }

    $scope.updateArticle = function (article_item , category) {
        var art = {'title': article_item.title, 'content': article_item.content , company_id: $site.company_id , id:article_item.id};
        
        if(article_item.id){
            article.customPUT(art, article_item.id).then(function () {
                toastr.success("Success! Article saved");
            });
        }
        else{

            if(category)
                art.category_id = category.id;

            article.customPOST(art).then(function (response) {
                toastr.success("Success! New Artucle is added");
                if(category)
                    category.articles[article_item.count] = response;
                else
                    $scope.unassigned_articles[article_item.count] = response;
                $scope.$broadcast('dataloaded');
            });
        }
    }
     $scope.saveSupport = function () {
        var categories = [];
        $.each($(".module_item"), function (key, category) {
            var articles = [];
            $.each($(category).find(".lesson_item"), function (key, article) {
                articles.push({
                    "category_id": $(category).data("id"), "article_id": $(article).data("id")
                });
            });

            categories.push({"category_id":$(category).data("id") , "articles":articles});

        });
        category.customPOST(categories, "creator").then(function (data) {
            toastr.success("Success! Support content saved!");

        });

    }


    $scope.dragControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope) {
            if(sourceItemHandleScope.itemScope.sortableScope.element[0].id!='12')
                return true;
            else
                return false;
            },
        itemMoved: function ($event) {console.log("moved"+$event.source.sortableScope);},//Do what you want},
        orderChanged: function($event) {console.log("orderchange"+$event);},//Do what you want},
        containment: '#board'//optional param.
    };

    $scope.dragModuleControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope){
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        },
        itemMoved: function ($event) {console.log("moved"+$event.source.sortableScope);},//Do what you want},
        orderChanged: function($event) {console.log("orderchange"+$event);},//Do what you want},
        containment: '#board'//optional param.
    };



});

app.controller('adminCannedResponsesController', function ($scope, $localStorage, $state, $site ,$stateParams, $responses,$filter, Restangular, toastr ) {
    //$scope.page = $page;
    $scope.responses = $responses;
    alert(0)
    $scope.currentPage = 1;
    $scope.loadMore = function(){
        $scope.disable = true;
        Restangular.all('cannedResponse').getList({p:++$scope.currentPage , company_id :$site.company_id}).then(function (responses) {
            $scope.responses = $scope.responses.concat(responses);
            if(responses.length>0)
                $scope.disable = false;
        });
    }
});

app.controller('adminCannedResponseController', function ($scope, $localStorage, $state,$site, $stateParams,$filter, Restangular, toastr ) {
    $scope.response = {company_id : $site.company_id}

    $scope.init = function()
    {
        if($stateParams.id){
            Restangular.one('cannedResponse',$stateParams.id).get().then(function(response){
                $scope.response = response;
            })
        }
    }

    $scope.save = function(){
        if($scope.response.id){
            $scope.response.put().then(function(response){
                toastr.success("Canned response edited successfully!");
                $state.go("service.support.canned-responses");
            })
        }

        else
        {
            Restangular.all('cannedResponse').post($scope.response).then(function(response){
                toastr.success("Canned response created successfully!");
                $state.go("service.support.canned-responses");
            })
        }
    }
});