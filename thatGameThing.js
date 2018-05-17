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

const boardInteractor = (() => {
	let boards = [{ "0,0": 100 }];
	const handler = gameHandler();

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
	
	const loadBoardsUpTo = (step) => {
		if (boards.length >= step) { return; }
		console.log(`getting boards up to ${step} from ${boards.length}`);
		const neededCount = step - boards.length;
		const nextBoards = handler.boardsUpToForBoard(neededCount, _.last(boards));
		console.log("NEXTBOARDS", nextBoards)
		boards = boards.concat(nextBoards.slice(1));
	}

	const animateBoards = (boards, outputFunc) => {
		if(boards.length === 0) { return; }
		outputFunc(displayStringForBoard(boards[0]));
		setTimeout(() => { animateBoards(boards.slice(1), outputFunc); }, 500);
	}
	
	const showAnimation = (config) => {
		const userInput = parseInt(config.getInput());
		loadBoardsUpTo(userInput);
		const boardsToAnimate = _.map(boards.slice(0, userInput), handler.toArray);
		animateBoards(boardsToAnimate, config.showOutput);
	}

	const showStep = (config) => {
		const userInput = parseInt(config.getInput());
		loadBoardsUpTo(userInput);
		const board = boards[userInput - 1];
		console.log(`Step ${userInput}`, board);
		config.showOutput(displayStringForBoard(handler.toArray(board)));
	}
	
	return { showAnimation, showStep };
})();
