app.directive( 'suiPopup', function(smModal)
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			var the_options = {
				hoverable: attributes.edit ? true : (attributes.hoverable || false),
				position : attributes.position || 'top center',
				//popup: '.special.popup',
				html: attributes.edit ? '<button class="ui tiny red button edit-admin" data-state="' + attributes.state + 
											'"  data-attributes="' + attributes.stateattributes + 
											'">edit button</button>' : '',
				target : attributes.target || '',
				exclusive: true,
				preserve: true,
				delay: {
					show: 100,
					hide: attributes.edit ? 500 : 20
				},
				onVisible: function(){
					$(".edit-admin").on('click',function(event){
						event.preventDefault();

						console.log($(this).data('attributes'));

						if ($(this).data('attributes')){
							smModal.Show($(this).data('state'), $(this).data('attributes'));
						}else{
							smModal.Show($(this).data('state'));
						}

						
						$(this).off(event);
					});
				},
				onHide: function(){
					$(".edit-admin").unbind('click');
					return true;
				}
			};
			$(next_item).popup(the_options);
		}
	};
} );