app.factory('smModal', function () {

    return {
        show: function(modal_id){
            $("#"+modal_id).modal('show');
        },
        hide: function(modal_id){
            $("#"+modal_id).modal('hide');
        }
    };

});