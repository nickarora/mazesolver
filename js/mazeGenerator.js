var MazeGenerator = function(rows,cols) {
	
	var TOP 		= 0;
	var BOTTOM 	= 1;
	var LEFT 		= 2;
	var RIGHT 	= 3;
	var DELTAS = [ [0,-1], [0,1], [-1,0], [1,0] ];

	var cellStack = [];

	var grid = initGrid();
	
	function initGrid() {
		var grid = new Array(cols);

		for(var x = 0; x < cols; x++) {
			grid[x] = new Array(rows);
			for(var y = 0; y < rows; y++) {
				cell = new Cell(x,y);
				grid[x][y] = cell;
			}
		}

		return grid;
	};

	function resetGrid() {
		rows = 20;
		cols = 30;

		for(var x = 0; x < cols; x++) {
			for(var y = 0; y < rows; y++) {
				grid[x][y].barriers = [true,true,true,true];
				grid[x][y].visited = false;
			}
		}

		return grid;
	};

	this.getGrid = function() {
		return grid;
	};

	this.generate = function() {
		resetGrid();
		var initialCell = grid[0][0];
		createMaze(initialCell);
	};

	function createMaze(cell) {
		cell.visit();

		neighbors = unvisitedNeighbors(cell);

		if (neighbors.length > 0) {
			var randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
			cellStack.push(cell);
			removeBarriersBetween(cell, randomNeighbor);
			createMaze(randomNeighbor);
		}
		else {
    	var nextCell = cellStack.pop();
    	if(nextCell) {
    		createMaze(nextCell);
    	}
    }

  };

  var getCell = function(coords) {
  	var x = coords[0];
		var y = coords[1];
		return grid[x][y];
  };

  function removeBarriersBetween(cell, otherCell) {

  	if (cell.x == otherCell.x) {
  		
  		if (cell.y < otherCell.y) { 
  			cell.removeBarrier(BOTTOM);
  			otherCell.removeBarrier(TOP);
  		} else {
  			cell.removeBarrier(TOP);
  			otherCell.removeBarrier(BOTTOM);
  		}

  	} else { //horizontal

  		if (cell.x < otherCell.x) { 
  			cell.removeBarrier(RIGHT);
  			otherCell.removeBarrier(LEFT);
  		} else {
  			cell.removeBarrier(LEFT);
  			otherCell.removeBarrier(RIGHT);
  		}

  	}
  };

  function unvisitedNeighbors(cell) {
  	var neighbors = [];

		_.each(DELTAS, function(delta){
			var newX = delta[0] + cell.x;
			var newY = delta[1] + cell.y;
			if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
				if (!grid[newX][newY].visited) {
					neighbors.push(getCell([newX,newY]))
				}
			}
		});

  	return neighbors;
  };

};