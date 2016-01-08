
app.filter('parseurl', function() {
    return function(input) {
    	if (input.indexOf('http') >= 0){
    		return input;
    	}
        else if(input.indexOf('mailto') == 0){
            //console.log()
            return input;
        }
    	else if(input.indexOf('www.') == 0){
    		//console.log()
    		return "http://"+input;
    	}
    	else if (input.charAt(0) != "/"){
            return "/" + input;
        }
        return input;
    };
});
