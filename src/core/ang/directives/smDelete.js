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
							})
						}
					})
					.modal('show');
			});
		}
	};
});