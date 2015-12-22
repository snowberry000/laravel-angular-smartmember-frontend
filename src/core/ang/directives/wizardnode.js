app.directive( 'wizardnode', function( $timeout )
{
	return {
		restrict: 'A',
		scope: true,
		controller: function( $scope, $element )
		{
			// Function for collapse ibox
			$scope.showhide = function()
			{
				var ibox = $element//.closest('div.ibox');
				var icon = $element.find( 'i:first' );
				var content = ibox.find( 'div.ibox-content' );
				content.slideDown( 200 );
				// Toggle icon from up to down
				icon.toggleClass( 'fa-chevron-up' ).toggleClass( 'fa-chevron-down' );
				ibox.toggleClass( '' ).toggleClass( 'border-bottom' );
				$timeout( function()
				{
					ibox.resize();
					ibox.find( '[id^=map-]' ).resize();
				}, 50 );
			};
			// Function for close ibox
			$scope.closebox = function()
			{
				var ibox = $element//.closest('div.ibox');
				ibox.remove();
			};

			// Function for close ibox
			$scope.ShowBox = function( node, id )
			{
				$scope.id = id;
				if( node.completed )
				{
					//return;
				}
				node.include_template = true;

				var ibox = $element.closest( 'div.ibox' );
				var content = ibox.find( 'div.ibox-content' );

				ibox.parent().find( 'div.ibox-content' ).each( function( e )
				{

					if( $( this ).parent().attr( 'id' ) !== ibox.attr( 'id' ) )
					{
						$( this ).removeClass( 'node_open' );
						$( this ).slideUp( 200 );
					}
					else
					{
						$( this ).toggleClass( 'node_open' );
						$( this ).slideToggle( 200 );
					}

				} );

				//content.addClass('node_open');
				//content.slideDown(200);

				$timeout( function()
				{
					ibox.resize();
					ibox.find( '[id^=map-]' ).resize();
				}, 50 );

			}

			$scope.HideBox = function( node )
			{

				node.include_template = true;

				var ibox = $element.closest( 'div.ibox' );
				var content = ibox.find( 'div.ibox-content' );

				ibox.parent().find( 'div.ibox-content' ).each( function( e )
				{

					if( $( this ).parent().attr( 'id' ) === ibox.attr( 'id' ) )
					{
						//$(this).removeClass('node_open');
						$( this ).slideUp( 200 );
					}
					if( $( this ).parent().attr( 'id' ) == (parseInt( ibox.attr( 'id' ) ) + 1) )
					{
						$scope.id = parseInt( $( this ).parent().attr( 'id' ) );
						$( this ).toggleClass( 'node_open' );
						$( this ).slideToggle( 200 );
					}

				} );

				$timeout( function()
				{
					ibox.resize();
					ibox.find( '[id^=map-]' ).resize();
				}, 50 );

			}
		}
	};
} );