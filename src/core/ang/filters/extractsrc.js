
app.filter('extractsrc', function () {
	return function (value) {
		if (!value) return '';

		//console.log( "THE VALUE", value );

		var regex = /<.*?src=[\'\"](.*?)[\'\"]/g;
		var src = regex.exec(value);
		if (src)
		{
			src = src[1];
		}
		return src;
	};
});