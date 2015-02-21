var Maze = function() {

	var TOP 		= 0;
	var BOTTOM 	= 1;
	var LEFT 		= 2;
	var RIGHT 	= 3;

	var width 	= 600;
	var height 	= 400;

	var rows 		= 20;
	var cols 		= 30;

	var cellWidth = width / cols;
	var cellHeight = height / rows;

	var canvas = document.getElementsByTagName("canvas")[0];

	var context = canvas.getContext('2d');

	var wallColor = "#99A638"
	var bgColor 	= "#D7D9B0"
	var solColor 	= "#DB7500"

	var gMaze = new MazeGenerator(rows, cols);

	initCanvas();

	this.generateMaze = function() {
		resetAnimation();
		gMaze.generate(); //updates its own grid
		return gMaze.getGrid();
	};

	this.animateSolution = function(solution) {
		resetAnimation();
		this.renderMaze();
		animate = setInterval(function () { drawPortion(solution) }, 50);
	};

	this.getMaze = function() {
		return gMaze.getGrid();
	};

	function resetAnimation() {
		counter = 0;
		if (typeof animate !== 'undefined') { clearInterval(animate); }
	}

	function drawPortion(solution) {
		i = counter;

		x = solution[i][0];
		y = solution[i][1];

		if ( (x+y) == 0 ) {
			dir1 = TOP;
			
			nextCell = solution[i+1];
			dir2 = findDirection(solution[i], nextCell);
		} else if ( (x+y) == (rows + cols - 2)) {
			prevCell = solution[i-1];
			dir1 = findDirection(solution[i], prevCell);

			dir2 = BOTTOM
		}
		else {
			
			prevCell = solution[i-1];
			nextCell = solution[i+1];

			dir1 = findDirection(solution[i], prevCell);
			dir2 = findDirection(solution[i], nextCell);

		}

		context.beginPath();
		context.strokeStyle = solColor;
		context.lineWidth = 3;
		drawLine(x,y, dir1, dir2); 
		context.stroke();

		counter++;
		if (counter >= solution.length) {
			clearInterval(animate);
		}
	}

	this.drawFullSolution = function(solution) {
		
		context.beginPath();
		context.strokeStyle = solColor;
		context.lineWidth = 3;

		for(var i = 0; i < solution.length; i++) {
			x = solution[i][0];
			y = solution[i][1];

			if ( (x+y) == 0 ) {
				dir1 = TOP;
				
				nextCell = solution[i+1];
				dir2 = findDirection(solution[i], nextCell);
			} else if ( (x+y) == (rows + cols - 2)) {
				prevCell = solution[i-1];
				dir1 = findDirection(solution[i], prevCell);

				dir2 = BOTTOM
			}
			else {
				
				prevCell = solution[i-1];
				nextCell = solution[i+1];

				dir1 = findDirection(solution[i], prevCell);
				dir2 = findDirection(solution[i], nextCell);

			}
			
			drawLine(x,y, dir1, dir2); 
		}

		context.stroke();
	}

	function findDirection(current, other) {
		curX = current[0];
		curY = current[1];

		othX = other[0];
		othY = other[1];

		xDelta = curX - othX;
		yDelta = curY - othY;

		if (xDelta == 0){
			if (yDelta < 0) {
				return BOTTOM;
			} else {
				return TOP;
			}
		} else if (xDelta < 0) {
			return RIGHT;
		} else {
			return LEFT;
		}
	}

	function drawLine( x, y, dir1, dir2) {
		
		xMid = x * cellWidth + (cellWidth/2);
		xLeft = x * cellWidth;
		xRight = x * cellWidth + cellWidth;
		
		yMid = y * cellHeight + (cellHeight/2);
		yTop = y * cellHeight;
		yBot = y * cellHeight + cellHeight;

		if ((dir1 == TOP && dir2 == BOTTOM) || (dir1 == BOTTOM && dir2 == TOP)) {
			context.moveTo(xMid, yTop);
    	context.lineTo(xMid, yBot);
    }

    if ((dir1 == LEFT && dir2 == RIGHT) || (dir1 == RIGHT && dir2 == LEFT)) {
	    context.moveTo(xLeft, yMid);
	    context.lineTo(xRight, yMid);
   	}

   	if ((dir1 == TOP && dir2 == LEFT) || (dir1 == LEFT && dir2 == TOP)) {
	    context.moveTo(xMid, yTop);
	    context.lineTo(xMid, yMid);
	    context.lineTo(xLeft, yMid);
  	}

  	if ((dir1 == TOP && dir2 == RIGHT) || (dir1 == RIGHT && dir2 == TOP)) {
	    context.moveTo(xMid, yTop);
	    context.lineTo(xMid, yMid);
	    context.lineTo(xRight, yMid);
    }

    if ((dir1 == BOTTOM && dir2 == LEFT) || (dir1 == LEFT && dir2 == BOTTOM)) {
	    context.moveTo(xMid, yBot);
	    context.lineTo(xMid, yMid);
	    context.lineTo(xLeft, yMid); 
  	}

  	if ((dir1 == BOTTOM && dir2 == RIGHT) || (dir1 == RIGHT && dir2 == BOTTOM)) {
    	context.moveTo(xMid, yBot);
    	context.lineTo(xMid, yMid);
    	context.lineTo(xRight, yMid);
  	}

	}

	function initCanvas() {
		canvas.width = width;
		canvas.height = height;
		document.body.appendChild(canvas);
	}
	
	function clearCanvas() { 
		context.fillStyle = bgColor;
		context.fillRect(0,0,width,height);	
	}

	this.renderMaze = function() {
		var maze = gMaze.getGrid();
		clearCanvas();
		renderBorder();

		context.beginPath();
		context.strokeStyle = wallColor;
		context.lineWidth = 2;

		for(var x = 0; x < cols; x++) {
			for(var y = 0; y < rows; y++){
				if ( (x != 0 && y != 0) && maze[x][y].barriers[TOP] == true) {
					context.moveTo(x * cellWidth, y * cellHeight);
    			context.lineTo(x * cellWidth + cellWidth, y * cellHeight);
				}
				if ( (x != 29 && y != 19) && maze[x][y].barriers[BOTTOM] == true) {
					context.moveTo(x * cellWidth, y * cellHeight + cellHeight);
    			context.lineTo(x * cellWidth + cellWidth, y * cellHeight + cellHeight);
				}
				if (maze[x][y].barriers[LEFT] == true) {
					context.moveTo(x * cellWidth, y * cellHeight);
    			context.lineTo(x * cellWidth, y * cellHeight + cellHeight);
				}
				if (maze[x][y].barriers[RIGHT] == true) {
					context.moveTo(x * cellWidth + cellWidth, y * cellHeight);
    			context.lineTo(x * cellWidth + cellWidth, y * cellHeight + cellHeight);
				}
			}
		}

		context.stroke();
	}

	function renderBorder() {
		context.beginPath();
		context.strokeStyle = wallColor;
		context.lineWidth = 4;

    context.moveTo(0, 0);
    context.lineTo(width, 0);
    
    context.moveTo(0, height);
    context.lineTo(width, height);
    
    context.moveTo(0, 0);
    context.lineTo(0, height);

    context.moveTo(width, 0);
    context.lineTo(width, height);
    context.stroke();

    context.beginPath();
    context.strokeStyle = bgColor;
    context.lineWidth = 4;

    context.moveTo(2, 0);
    context.lineTo(cellWidth, 0);

    context.moveTo(width - cellWidth, height);
    context.lineTo(width - 2, height);

    context.stroke();
	}
};

var initMaze = function() {
	mazeHandler = new Maze;
	mazeSolver = new mazeSolver(mazeHandler.generateMaze());
	mazeHandler.renderMaze();
};

var generate = function() {
	mazeSolver.updateMaze(mazeHandler.generateMaze());
	mazeHandler.renderMaze();
};

var solve = function(){
	solution = mazeSolver.solve();
	mazeHandler.animateSolution(solution);
};
