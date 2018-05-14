let pigLatinApp;

window.onload = () => {
	const pigLatin = Vue.component('pig-latin', {
		template: '<div><input class="form-control" v-model="message"></input><br><p>{{pigLatin}}</p></div>',
		data: function () {
			return { message: "Type here, pig latin below." }
		},
	  computed: {
		  pigLatin: function () {
			  return this.pigLatinWords(this.message);
		  }
	  },
	  methods: {
		  pigLatinWord: function (word) {
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
		  },
		  pigLatinWords: function (words) {
		  	const wordArray = words.split(" ");
		  	const pigLatined = _.map(wordArray, this.pigLatinWord);
		  	return pigLatined.join(" ");
		  }
	  }
	});

	pigLatinApp = new Vue({
		el: '#pigLatin',
		components: {
			pigLatin
		}
	})
}
