app.directive( 'smDelete', function()
{
	return {
		restrict: 'A',
		link: function( scope, element, attributes ){
			element.bind('click',function(){
				$(".small.delete.modal")
					.modal({
						allowMultiple: true,
						onApprove: function(){
                            if( attributes.deleteFunction && typeof scope[ attributes.deleteFunction ] == 'function' )
                                scope[ attributes.deleteFunction ]( attributes.smDelete );
                            else
							    scope.deleteResource(attributes.smDelete);
							return true;
						},
						onHidden: function() {
							$('.small.delete.modal').each(function(i) {
								if (i > 0)
									$(this).remove();
							})
						},
						onShow: function() {
							$('.small.delete.modal').each(function(i) {
								if (i > 0)
									$(this).remove();
                                else
                                    $(this).css('z-index','1000000');
							})
						}
					})
					.modal('show');
			});
		}
	};
});