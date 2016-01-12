app.directive('smJvzooTrigger', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element,smModal) {
            $("sm_jvzoo_buy_trigger").on('click',function(){
                smModal.Show('templates/modals/sm-jvzoo-buy.html');
            });
        }
    };
});