var mazeTreeNode = function(pos) {
	this.parent = null;
	this.children = [];
	this.pos = pos;

	var self = this;

	this.setParent = function(otherParent) {
		if (this.parent) {
			deleteFromArray(this.parent.children, this.parent);
		}
		
		this.parent = otherParent;

		if (otherParent) {
			otherParent.children.push(this);
		}
	};

	this.addChild = function(childNode) {
		childNode.setParent(this);
	};

	this.removeChild = function(childNode) {
  	if ( _.contains(this.children, childNode) ) {
  		childNode.setParent(null);
  		deleteFromArray(this.children, childNode);
  	}
	};

	this.bfs = function(targetPos) {
		if (!targetPos) {
			return null;
		}

		queue = [this];
		while (queue.length > 0) {
			currentNode = queue.shift();
			
			if (currentNode.pos[0] == targetPos[0] && currentNode.pos[1] == targetPos[1]) {
				return currentNode;
			}
   		
   		_.each(currentNode.children, function(child){
   			queue.push(child);
   		});
		}

		return null;
	};

	this.tracePathBack = function() {
		if (this.parent == null) {
			return [this.pos];
		}
		
		parent = this.parent;
		arr1 = parent.tracePathBack();
		arr2 = [this.pos];
		new_arr = arr2.concat(arr1);
		return new_arr;
	};

	function deleteFromArray(array, el) {
		for(var i = array.length - 1; i >= 0; i--) {
	    if(array[i] === el) {
	       array.splice(i, 1);
	    }
		}

		return array;
	};

};