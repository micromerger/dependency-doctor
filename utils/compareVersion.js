exports.compareVersion = (a, b) => {
	if (a === b) {
		return 'Latest Version';
	}

	var a_components = a.split('.');
	var b_components = b.split('.');

	var len = Math.min(a_components.length, b_components.length);

	for (var i = 0; i < len; i++) {
		if (parseInt(a_components[i]) > parseInt(b_components[i])) {
			if (i === 0) return 'Major Update';
			if (i === 1) return 'Minor Update';
			if (i === 2) return 'Patch Update';
		}

		if (parseInt(a_components[i]) < parseInt(b_components[i])) {
			return 'Wrong Version';
		}
	}

	if (a_components.length > b_components.length) {
		return 'Wrong Version';
	}

	if (a_components.length < b_components.length) {
		return 'Wrong Version';
	}
	return 'Latest Version';
};
