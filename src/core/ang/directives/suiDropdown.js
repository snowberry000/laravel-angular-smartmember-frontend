app.directive( 'suiDropdown', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$(next_item).dropdown();
			$(next_item).on('keydown' , function(event){
				if (event.which == 13){
					var href = $('.item.selected:first a').attr('href');
					if(href)
						window.location.href = href;
				}
			})
		}
	};
} );