app.directive( 'suiDropdown', function($timeout)
{
	return {
		restrict: 'A',
        require: '?ngModel',
        scope: {
            ngModel: '='
        },
		link: function( scope, next_item, attributes, ngModel  )
		{
			$(next_item).dropdown();

            if(ngModel){
                /*
                angular.forEach(ngModel.$modelValue,function(value){
                    $(next_item).parent().find('[data-value=' + value + ']').click();
                });
                */
            }

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