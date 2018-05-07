const gameHandler = () => {
	const keyForCords = (xCord, yCord) => `${xCord},${yCord}`;

	const cordsForKey = (cord) => {
		const split = cord.split(",");
		const xCord = parseInt(split[0]);
		const yCord = parseInt(split[1]);
		return { xCord, yCord };
	}

	const nextCords = (cord) => {
		console.log("NEXTCOORDS:", cord);

		const { xCord, yCord } = cordsForKey(cord);
		return [
			keyForCords(xCord, yCord+1),
			keyForCords(xCord+1, yCord),
			keyForCords(xCord, yCord-1),
			keyForCords(xCord-1, yCord)
		];
	};

	const nextBoard = (board) => {
		const next = {};
		_.each(board, (value, cord) => {
			console.log("NEXTBOARD: V:", value, "K:", cord);
			const nexts = nextCords(cord);
			_.each(nexts, (cord) => {
				const currentValue = next[cord] || 0;
				next[cord] = currentValue + value / nexts.length;
			});
		});
		return next;
	}
	
	function* boardMaker(initialBoard) {
		let currentBoard = initialBoard;
		while(true) {
			currentBoard = nextBoard(currentBoard);
			yield currentBoard;
		}
	}
	
	const boardsUpToForBoard = (step, fromBoard) => {
		const generator = boardMaker(fromBoard);
		return _.tap([fromBoard], (boards) => {
			_.times(step, () => { boards.push(generator.next().value); });
		});
	}
	
	const toArray = (board) => {
		const boardArray = [];
		let xOffset = 0, yOffset = 0;
		let xMax = 0;
	
		_.each(board, (value, cord) => {
			const { xCord, yCord } = cordsForKey(cord);
			if(xOffset < xCord * -1) xOffset = xCord * -1;
			if(yOffset < yCord * -1) yOffset = yCord * -1;
		});
	
		_.each(board, (value, cord) => {
			let { xCord, yCord } = cordsForKey(cord);
			xCord += xOffset;
			yCord += yOffset;
		
			if(xMax < xCord) xMax = xCord;
		
			while(yCord >= boardArray.length) {
				boardArray.push([]);
			}
			while(xCord >= boardArray[yCord].length) {
				boardArray[yCord].push(0);
			}
			boardArray[yCord][xCord] = value;
		});

		_.each(boardArray, (row) => {
			while(row.length <= xMax) row.push(0);
		});

		return boardArray;
	}

	return {
		nextCords,
		nextBoard,
		cordsForKey,
		keyForCords,
		boardsUpToForBoard,
		toArray
	};
}

const showAnimation = (gameConfig) => {
	const initialBoard = { "0,0": 100 };
	const handler = gameHandler();
	const userInput = parseInt(gameConfig.getInput());
	const boardsUpTo = handler.boardsUpToForBoard(userInput, initialBoard);
	const boardsToAnimate = _.map(boardsUpTo, handler.toArray);
	animateBoards(boardsToAnimate, gameConfig.showOutput);
}

const showStep = (gameConfig) => {
	const initialBoard = { "0,0": 100 };
	const handler = gameHandler();
	const userInput = parseInt(gameConfig.getInput());
	const board = _.last(handler.boardsUpToForBoard(userInput, initialBoard));
	console.log(`Step ${userInput}`, board);
	gameConfig.showOutput(displayStringForBoard(handler.toArray(board)));
}

toRun.push({
	description: "This shows probabilities for where a character might end up when starting in a location with equal probability of moving in any direction for a certain number of moves.",
	buttons: [{title: "Animate", action: showAnimation}, {title: "Show", action: showStep}]
});

const displayStringForBoard = (board) => {
	return _.map(board, (row) => {
		const roundedRow = _.map(row, (value) => _.round(value, 2));
		let rowString = "";
		_.each(roundedRow, (value) => {
			rowString += value;
			rowString += '\t';
			if (value < 10) rowString += '\t';
		});
		return _.trimEnd(rowString);
	}).join('\n');
}

const animateBoards = (boards, outputFunc) => {
	if(boards.length === 0) { return; }
	outputFunc(displayStringForBoard(boards[0]));
	setTimeout(() => { animateBoards(boards.slice(1), outputFunc); }, 500);
}
