const pigLatinWord = (word) => {
	const isCapitalized = (string) => {
		return string.slice(0, 1) === string.slice(0, 1).toUpperCase();
	}

	const capitalizeFirst = (string) => {
		return string.slice(0, 1).toUpperCase() + string.slice(1);
	}

	const wasCapitalized = isCapitalized(word);
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

toRun.push({
	description: "Pig Latin",
	buttons: [{title: "Translate", action: config => config.showOutput(pigLatinWords(config.getInput())) }]
});
