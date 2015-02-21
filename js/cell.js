var Cell = function(x,y) {
	
	var TOP 		= 0;
	var BOTTOM 	= 1;
	var LEFT 		= 2;
	var RIGHT 	= 3;

	var self = this;

	this.x 				= x;
	this.y 				= y;
	this.visited 	= false;

	this.barriers = [true,true,true,true];

	this.visit = function() {
		self.visited = true;
	};

	this.removeBarrier = function(dir) {
		self.barriers[dir] = false;
	};

};