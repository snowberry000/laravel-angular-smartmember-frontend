
app.filter('extractsrc', function () {
	return function (value) {
		if (!value) return '';

		var regex = /<iframe.*?src=[\'\"](.*?)[\'\"]/g;
		var src = regex.exec(value)[1];

		return src;
	};
});