var toRun = [
	{
		description: "Pig Latin",
		buttons: [{title: "Translate", action: config => config.showOutput(pigLatinWords(config.getInput())) }]
	},
	{
		description: "This shows probabilities for where a character might end up when starting in a location with equal probability of moving in any direction for a certain number of moves.",
		buttons: [{title: "Animate", action: boardInteractor.showAnimation}, {title: "Show", action: boardInteractor.showStep}]
	}
];

const buildDisplay = (elementId, runConfig) => {
	console.log(`Buidling display for element ${elementId}`);
	const contentElement = document.getElementById(elementId);
	contentElement.className = "contentArea";
	
	const addInDiv = (newElement) => {
		const div = document.createElement("div");
		div.className = "contentItem";
		div.appendChild(newElement);
		contentElement.appendChild(div);
	};
	
	_.tap(document.createTextNode(runConfig.description), (desc) => {
		addInDiv(desc);
	});

	const input = _.tap(document.createElement("input"), (input) => {
		input.className = "form-control";
		addInDiv(input);
	});
	
	const output = _.tap(document.createElement("textArea"), (output) => {
		output.className = "form-control";
	});

	const getInput = () => {
		const inputVal = input.value;
		console.log(`${elementId}: Returning input value ${inputVal}`);
		return inputVal;
	};

	const showOutput = (content) => {
		console.log(`${elementId}: Showing output ${content}`);
		output.value = content;
	}

	const elementConfig = {
		getInput,
		showOutput
	};

	_.tap(document.createElement("div"), (buttonsDiv) => {
		_.each(runConfig.buttons, (buttonConfig) => {
			_.tap(document.createElement("button"), (runButton) => {
				runButton.appendChild(document.createTextNode(buttonConfig.title));
				runButton.className = "btn btn-default";
				runButton.onclick = () => buttonConfig.action(elementConfig);
				buttonsDiv.appendChild(runButton);
			});
		});
		addInDiv(buttonsDiv);
	});

	addInDiv(output);
}


$.ajaxPrefilter( function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
    options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
  }
});

const makeRequest = (path, handler, error) => {
	console.log(`Making request to ${path}`);

	$.ajax({
		url: path,
		type: "GET",
		dataType: "json",
		jsonpCallback: 'callback',
		headers: {
		        'Content-Type': 'application/x-www-form-urlencoded'
		    },
		success: handler,
			error: error
	});
};

const makeAndDisplayRequest = () => {
	// http://xkcd.com/615/info.0.json
	makeRequest(getInput(), (result) => showOutput(JSON.stringify(result, null, 2)));
}






