

app.filter('cut', function () {
	return function (value, wordwise, max, tail) {
		if (!value) return '';

		max = parseInt(max, 10);
		if (!max) return value;
		if (value.length <= max) return value;

		value = value.substr(0, max);
		if (wordwise) {
			var lastspace = value.lastIndexOf(' ');
			if (lastspace != -1) {
				value = value.substr(0, lastspace);
			}
		}
		value = value.replace(/&apos;/gi, '\'').replace(/&amp;/gi, '\&').replace(/&quot;/gi,'\"').replace(/&nbsp;/gi,'');
		return value + (tail || ' …');
	};
});