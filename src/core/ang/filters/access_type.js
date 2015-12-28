
app.filter('accessType', function() {
    return function(input) {
    	switch(input){
            case 1: 
                return "Public";
            case 2: 
                return "Access Level";
            case 3: 
                return "Members";
            case 4: 
                return "Private";
        }
    };
});
