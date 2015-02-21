var mazeSolver = function(userMaze) {

	var TOP 		= 0;
	var BOTTOM 	= 1;
	var LEFT 		= 2;
	var RIGHT 	= 3;
	var DELTAS = [ [0,-1], [0,1], [-1,0], [1,0] ];

	var startPos = [0,0];
	var endPos = [29,19];
	var rootNode = new mazeTreeNode(startPos);

	var maze = userMaze;

	this.updateMaze = function(newMaze) {
		maze = newMaze;
	};

	this.solve = function() {
		maze = mazeHandler.getMaze();
		resetCells();
		rootNode = new mazeTreeNode(startPos);
		this.buildTree();
		return this.findPath(endPos);
	};

	this.getNeighbors = function(pos) {
		var x = pos[0];
		var y = pos[1];

		neighbors = [];
		cell = maze[x][y];
		
		for(var dir = 0; dir < 4; dir++) {
			if (!cell.barriers[dir]) {
				coords = [DELTAS[dir][0] + x, DELTAS[dir][1] + y];
				if (maze[coords[0]][coords[1]].visited == false) {
					neighbors.push(coords);
				}
			}
		}

		return neighbors;
	};

	this.buildTree = function() {
		queue = [rootNode];

		while (queue.length > 0) {
			currentNode = queue.shift();
			newMoves = this.getNeighbors(currentNode.pos);
			for (var i = 0; i < newMoves.length; i++) {
				newNode = new mazeTreeNode(newMoves[i]);
				currentNode.addChild(newNode);
				queue.push(newNode);
				visit(newMoves[i]);
			}
		}

		return;
	};

	this.findPath = function(pos) {
		result = rootNode.bfs(pos).tracePathBack();
		return result.reverse();
	};

	function resetCells(){
		rows = 20;
		cols = 30;

		for(var x = 0; x < cols; x++) {
			for(var y = 0; y < rows; y++) {
				maze[x][y].visited = false;
			}
		}

		visit([0,0]);
	};

	function visit(pos){
		x = pos[0];
		y = pos[1];
		maze[x][y].visit();
	};

};