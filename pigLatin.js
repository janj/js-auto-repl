const pigLatinWord = (word) => {
	const capitalizeFirst = (string) => {
		return string.slice(0, 1).toUpperCase() + string.slice(1);
	}

	const wasCapitalized = word.slice(0, 1) === word.slice(0, 1).toUpperCase();
	const regResult = /(\w*)(.*)/.exec(word);
	const cleanWord = regResult[1];
	const punctuation = regResult[2];
	
	const first = cleanWord.slice(0,1).toLowerCase();
	let rest = cleanWord.slice(1);
	if (wasCapitalized) {
		rest = capitalizeFirst(rest);
	}
	return `${rest}${first}ay${punctuation}`;
}

const pigLatinWords = (words) => {
	const wordArray = words.split(" ");
	const pigLatined = _.map(wordArray, pigLatinWord);
	return pigLatined.join(" ");
}
