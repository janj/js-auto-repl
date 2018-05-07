(function styleInit() {
	const styleRules = [];
	styleRules.push(".contentArea { padding: 25px; }");
	styleRules.push(".contentItem { padding-bottom: 10px; }")
	const style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML = styleRules.join("\n");
	document.head.appendChild(style);
})();

var toRun = [];

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

	const input = _.tap(document.createElement("input"), (input) => {
		input.className = "form-control";
		addInDiv(input);
	});
	
	const output = _.tap(document.createElement("textArea"), (output) => {
		output.className = "form-control";
		addInDiv(output);
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

	const run = () => {
		const input = getInput();
		console.log(`${elementId}: Running with input ${input}`);
		runConfig.runFunc(elementConfig);
	}
	
	_.tap(document.createElement("button"), (runButton) => {
		runButton.appendChild(document.createTextNode("Run"));
		runButton.className = "btn btn-default";
		runButton.onclick = run;
		addInDiv(runButton);
	});
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






