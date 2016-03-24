app.controller( 'AdminAppSmartSitePageCreationController', function( $scope, toastr, $stateParams, $rootScope, $state, $localStorage, $location, Restangular, RestangularV3, $filter, $sce, smMembers )
{
    RestangularV3.one( 'site/getBySubdomain' ).get({subdomain: $stateParams.subdomain}).then( function( response )
    {
        $scope.new_content = {
            title: '',
            permalink: '',
            layout: 'left-sidebar',
            site_id: String( response._id )
        }

        RestangularV3.service('page').getList({parents_only: true, site_id: String( response._id ), no_boxes: true}).then(function(response){
            $scope.pages = $scope.flatten_pages( response );
        });

        $scope.flatten_pages = function( pages, dashes, final_pages ) {
            if( !dashes )
                dashes = "";

            if( !final_pages )
                final_pages = [];

            angular.forEach( pages, function( value, key ) {
                final_pages.push({
                    _id: value._id,
                    title: dashes + value.title
                });

                if( value.children && value.children.length > 0 )
                    final_pages = $scope.flatten_pages( value.children, dashes + "-", final_pages );
            } );

            return final_pages;
        }

        RestangularV3.service('page/getTypes').getList({site_id: String( response._id ), no_boxes: true, no_children: true}).then(function(response){
            $scope.types = response;
        });
    } )

    $scope.layout_options = [
        {value: 'left-sidebar', label: 'Left Sidebar'},
        {value: 'right-sidebar', label: 'Right Sidebar'},
        {value: 'both-sidebars', label: 'Both Sidebars'},
        {value: 'no-sidebar', label: 'No Sidebar'}
    ];

    $scope.setPermalink = function( $event )
    {
        if( !$scope.new_content.permalink )
        {
            $scope.new_content.permalink = $filter( 'urlify' )( $scope.new_content.title ).toLowerCase();
        }
    }

    $scope.onBlurSlug = function( $event )
    {
        if( $scope.new_content.permalink )
        {
            $scope.new_content.permalink = $filter( 'urlify' )( $scope.new_content.permalink );
        }
    }

    $scope.add = function() {
        if(!$scope.new_content.title){
            toastr.error("Title cannot be empty.");
            return;
        }

        if( $scope.new_content.type )
        {
            if( $scope.new_content.type == 'none' )
            {
                delete $scope.new_content.type;

                if( $scope.new_content.new_type )
                    $scope.new_content.type = $scope.new_content.new_type;
            }
        }
        else
        {
            if( $scope.new_content.new_type )
                $scope.new_content.type = $scope.new_content.new_type;
        }

        delete $scope.new_content.new_type;

        var template = $scope.selectedTemplate();

        if( template ) {
            $scope.new_content.boxes = $scope.getBoxes( template.boxes );
        }

        Restangular.service('checkPermalink').post( $scope.new_content).then( function( response ) {

            $scope.new_content.permalink = response.permalink;

            RestangularV3.service('page').post( $scope.new_content ).then( function( response2 ) {
                $state.go( 'admin.app.smart-sites.page', {id: response2._id, subdomain: $stateParams.subdomain} );
                //window.history.pushState({},"", '/page-content/' + response2.full_permalink );//this prevents the ~2F thing that angular puts in params with slashes
            } );
        } )
    }

    $scope.previewImage = function() {
        var template = $scope.selectedTemplate();

        if( template )
            return template.image;

        return false;
    }

    $scope.getBoxes = function( boxes ) {
        var new_boxes = [];

        angular.forEach( boxes, function( value, key ) {
            angular.forEach( value, function( value2, key2 ) {
                var column = false;
                switch( key ) {
                    case 'main':
                        column = 'main';
                        break;
                    case 'left':
                        if( $scope.new_content.layout == 'left-sidebar' || $scope.new_content.layout == 'both-sidebars' )
                            column = 'left';
                        else if( $scope.new_content.layout == 'right-sidebar' )
                            column = 'right';
                        break;
                    case 'right':
                        if( $scope.new_content.layout == 'right-sidebar' || $scope.new_content.layout == 'both-sidebars' )
                            column = 'right';
                        else if( $scope.new_content.layout == 'left-sidebar' )
                            column = 'left';
                        break;
                }

                if( column ) {
                    var new_box = $scope.getBox( value2, column );

                    if( new_box )
                        new_boxes.push( new_box );
                }
            } );
        } );

        return new_boxes;
    }

    $scope.getBox = function( box, column ) {
        if( !column )
            column = 'main';

        var box_default = _.find( boxTypes, {id: box});

        if( box_default ) {
            var new_box = {
                type: box,
                column: column
            };

            if( box_default.default_settings ) {
                angular.forEach(box_default.default_settings, function (value, key) {
                    new_box[key] = value;
                });
            }

            return new_box;
        }

        return false;
    }

    $scope.selectedTemplate = function() {
        if( $scope.new_content.template && $scope.new_content.template != 'blank' )
        {
            var template = _.find( $scope.starting_templates, {id: $scope.new_content.template});

            if( template )
                return template;
        }

        return false;
    }

    $scope.starting_templates = [
        {
            id: 'basic',
            title: 'Basic Page',
            image: '/images/image.png',
            description: 'Title + text',
            boxes: {
                'left': [

                ],
                'right': [

                ],
                main: [
                    'header',
                    'text'
                ]
            }
        },
        {
            id: 'video',
            title: 'Video content',
            image: '/images/image.png',
            description: 'Title + video + transcript',
            boxes: {
                'left': [

                ],
                'right': [

                ],
                main: [
                    'header',
                    'video',
                    'transcript'
                ]
            }
        },
        {
            id: 'fully-featured',
            title: 'Fully-featured',
            image: '/images/image.png',
            description: 'Title + image + video + transcript + text',
            boxes: {
                'left': [

                ],
                'right': [

                ],
                main: [
                    'header',
                    'image',
                    'video',
                    'transcript',
                    'text'
                ]
            }
        },
        {
            id: 'downloadable',
            title: 'Downloadable',
            image: '/images/image.png',
            description: 'Title + download + text',
            boxes: {
                'left': [

                ],
                'right': [

                ],
                main: [
                    'header',
                    'download',
                    'text'
                ]
            }
        }
    ];
} );

