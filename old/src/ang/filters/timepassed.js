app.filter('timepassed',function($filter) {
    return function(input) {
        if (input) {
            var i = input.replace(/\s+/g, 'T');
            return $filter("timeago")(i);
        }
    }
});