/**
 * AVL TREE Class
 *
 * @author Brice Chevalier
 *
 * @param {function} comparisonFunction comparison function that takes two parameters a and b and returns a number
 *
 * @desc Avl Tree data structure, keep elements sorted.
 */

function TreeNode(obj, container) {
	this.object = obj;
	this.height = 1;
	this.left   = null;
	this.right  = null;
	this.parent = null;
	this.container = container;
}

function AvlTree(comparisonFunction) {
	this.length = 0;
	this.root = null;
	this.cmpFunc = comparisonFunction;
}

AvlTree.prototype._addLeft = function (node, parent) {
	node.parent = parent;
	parent.left = node;
};

AvlTree.prototype._addRight = function (node, parent) {
	node.parent = parent;
	parent.right = node;
};

AvlTree.prototype.popSmallest = function () {
	// Fetching the node of the smallest element
	var smallestNode = this.root;
	while (smallestNode.left !== null) {
		smallestNode = smallestNode.left;
	}

	// Removing it
	this.removeByReference(smallestNode);

	// Returning smallest element
	return smallestNode.object;
};

AvlTree.prototype.popGreatest = function () {
	// Fetching the node of the greatest element
	var greatestNode = this.root;
	while (greatestNode.right !== null) {
		greatestNode = greatestNode.right;
	}

	// Removing it
	this.removeByReference(greatestNode);

	// Returning greatest element
	return greatestNode.object;
};

AvlTree.prototype.add = function (obj) {
	this.length += 1;
	var newNode = new TreeNode(obj, this);
	if (this.root === null) {
		this.root = newNode;
		return newNode;
	}

	var current = this.root;
	for (;;) {
		var cmp = this.cmpFunc(obj, current.object);
		if (cmp < 0) {
			// Adding to the left
			if (current.left === null) {
				this._addLeft(newNode, current);
				break;
			} else {
				current = current.left;
			}
		} else if (cmp > 0) {
			// Adding to the right
			if (current.right === null) {
				this._addRight(newNode, current);
				break;
			} else {
				current = current.right;
			}
		} else {
			if (current.left === null) {
				this._addLeft(newNode, current);
				break;
			} else if (current.right === null) {
				this._addRight(newNode, current);
				break;
			} else {
				if (current.right.height < current.left.height) {
					current = current.right;
				} else {
					current = current.left;
				}
			}
		}
	}

	if (current.height === 1) {
		this._balance(newNode.parent, false);
	}

	return newNode;
};

AvlTree.prototype._balanceLeftRight = function (node) {
	var left  = node.left;
	var right = left.right;

	var a = left.left;
	var b = right.left;

	right.left = left;
	node.left  = right;

	right.parent = node;
	left.parent  = right;

	left.left  = a;
	left.right = b;

	var aHeight = 0;
	if (a !== null) {
		aHeight = a.height;
		a.parent = left;
	}

	var bHeight = 0;
	if (b !== null) {
		bHeight = b.height;
		b.parent = left;
	}
	
	var leftHeight = ((aHeight > bHeight) ? aHeight : bHeight) + 1;
	left.height = leftHeight;

	var rightHeight = (right.right === null) ? 0 : right.right.height;
	right.height = ((leftHeight > rightHeight) ? leftHeight : rightHeight) + 1;
};

AvlTree.prototype._balanceLeftLeft = function (node) {
	var left = node.left;
	var c = left.right;

	var parent = node.parent;
	if (node === this.root) {
		this.root = left;
	} else {
		if (parent.right === node) {
			parent.right = left;
		} else {
			parent.left = left;
		}
	}

	left.right = node;
	left.parent = parent;
	node.parent = left;
	node.left = c;

	var leftHeight;
	if (c === null) {
		leftHeight = 0;
	} else {
		c.parent = node;
		leftHeight = c.height;
	}

	var rightHeight = (node.right === null) ? 0 : node.right.height;
	node.height = ((leftHeight > rightHeight) ? leftHeight : rightHeight) + 1;
};

AvlTree.prototype._balanceRightLeft = function (node) {
	var right = node.right;
	var left = right.left;

	var a = right.right;
	var b = left.right;

	left.right = right;
	node.right = left;

	left.parent  = node;
	right.parent = left;

	right.right = a;
	right.left  = b;

	var aHeight = 0;
	if (a !== null) {
		aHeight = a.height;
		a.parent = right;
	}

	var bHeight = 0;
	if (b !== null) {
		bHeight = b.height;
		b.parent = right;
	}
	
	var rightHeight = ((aHeight > bHeight) ? aHeight : bHeight) + 1;
	right.height = rightHeight;

	var leftHeight = (left.left === null) ? 0 : left.left.height;
	left.height = ((leftHeight > rightHeight) ? leftHeight : rightHeight) + 1;
};


AvlTree.prototype._balanceRightRight = function (node) {
	var right = node.right;
	var c = right.left;

	if (node === this.root) {
		this.root = right;
	} else {
		if (node.parent.left === node) {
			node.parent.left = right;
		} else {
			node.parent.right = right;
		}
	}

	right.left = node;
	right.parent = node.parent;
	node.parent = right;
	node.right = c;

	var rightHeight;
	if (c === null) {
		rightHeight = 0;
	} else {
		c.parent = node;
		rightHeight = c.height;
	}

	var leftHeight = (node.left === null) ? 0 : node.left.height;
	node.height = ((leftHeight > rightHeight) ? leftHeight : rightHeight) + 1;
};

AvlTree.prototype._balance = function (node, goAllTheWay) {
	// Balancing the tree
	var current = node;
	while (current !== null) {
		var left  = current.left;
		var right = current.right;

		var leftHeight  = (left  === null) ? 0 : left.height;
		var rightHeight = (right === null) ? 0 : right.height;

		if (leftHeight - rightHeight > 1) {
			// Left case
			if (left.right !== null && (left.left === null || left.left.height < left.right.height)) {
				// Left Right Case
				this._balanceLeftRight(current);
			}

			// Left Left Case
			this._balanceLeftLeft(current);
		} else if (rightHeight - leftHeight > 1) {
			// Right case
			if (right.left !== null && (right.right === null || right.right.height < right.left.height)) {
				// Right Left Case
				this._balanceRightLeft(current);
			}

			// Right Right Case
			this._balanceRightRight(current);
		} else {
			// TreeNode is balanced
			var newHeight = ((leftHeight > rightHeight) ? leftHeight : rightHeight) + 1;
			if (!goAllTheWay) {
				if (newHeight === current.height) {
					break;
				}
			}

			current.height = newHeight;
		}

		current = current.parent;
	}
};

AvlTree.prototype.removeByReference = function (node) {
	if (node.container !== this) {
		return node;
	}

	this.length -= 1;

	// Replacing the node by the smallest element greater than it
	var parent = node.parent;
	var left   = node.left;
	var right  = node.right;

	if (node.right === null) {
		if (left !== null) {
			left.parent = parent;
		}

		if (parent === null) {
			this.root = left;
		} else {
			if (parent.right === node) {
				parent.right = left;
			} else {
				parent.left = left;
			}

			if (left === null) {
				this._balance(parent, true);
			} else {
				if (left.height + 3 <= parent.height) {
					this._balance(parent, true);
				}
			}
		}

		return true;
	}

	var replacement = node.right;
	if (replacement.left === null) {
		if (left !== null) {
			left.parent = replacement;
		}
		replacement.left = left;

		if (parent === null) {
			this.root = replacement;
		} else {
			if (parent.right === node) {
				parent.right = replacement;
			} else {
				parent.left = replacement;
			}
		}
		replacement.parent = parent;

		this._balance(replacement, true);
		return true;
	}

	replacement = replacement.left;
	while (replacement.left !== null) {
		replacement = replacement.left;
	}

	if (replacement.right !== null) {
		replacement.right.parent = replacement.parent;
	}
	replacement.parent.left = replacement.right;

	if (right !== null) {
		right.parent = replacement;
	}
	replacement.right = right;


	if (left !== null) {
		left.parent = replacement;
	}
	replacement.left = left;

	if (parent === null) {
		this.root = replacement;
	} else {
		if (parent.right === node) {
			parent.right = replacement;
		} else {
			parent.left = replacement;
		}
	}

	var balanceFrom = replacement.parent;
	replacement.parent = parent;

	this._balance(balanceFrom, true);

	// Removing any reference from the node to any other element
	node.left      = null;
	node.right     = null;
	node.parent    = null;
	node.container = null;

	return null;
};

AvlTree.prototype.getSmallestAbove = function (obj) {
	if (this.root === null) {
		return null;
	}

	var smallestAbove = null;
	var current = this.root;
	while (current !== null) {
		var cmp = this.cmpFunc(obj, current.object);
		if (cmp < 0) {
			smallestAbove = current.object;
			// Searching left
			current = current.left;
		} else if (cmp > 0) {
			// Searching right
			current = current.right;
		} else {
			return current.object;
		}
	}

	return smallestAbove;
};

AvlTree.prototype.getGreatestBelow = function (obj) {
	if (this.root === null) {
		return null;
	}

	var greatestBelow = null;
	var current = this.root;
	while (current !== null) {
		var cmp = this.cmpFunc(obj, current.object);
		if (cmp < 0) {
			// Searching left
			current = current.left;
		} else if (cmp > 0) {
			greatestBelow = current.object;
			// Searching right
			current = current.right;
		} else {
			return current.object;
		}
	}

	return greatestBelow;
};

AvlTree.prototype._forEach = function (node, processingFunc, params) {
	if (node !== null) {
		this._forEach(node.left, processingFunc, params);
		processingFunc(node.object, params);
		this._forEach(node.right, processingFunc, params);
	}
};

AvlTree.prototype.forEach = function (processingFunc, params) {
	this._forEach(this.root, processingFunc, params);
};

AvlTree.prototype._forEachReverse = function (node, processingFunc, params) {
	if (node !== null) {
		this._forEachReverse(node.right, processingFunc, params);
		processingFunc(node.object, params);
		this._forEachReverse(node.left, processingFunc, params);
	}
};

AvlTree.prototype.forEachReverse = function (processingFunc, params) {
	this._forEachReverse(this.root, processingFunc, params);
};

AvlTree.prototype.clear = function () {
	this._clearEachNode(this.root)
	this.length = 0;
	this.root = null;
};

AvlTree.prototype._clearEachNode = function (node) {
	if (node !== null) {
		this._clearEachNode(node.left);
		this._clearEachNode(node.right);
		node.left      = null;
		node.right     = null;
		node.parent    = null;
		node.container = null;
	}
};

AvlTree.prototype._toArray = function (node, objects) {
	if (node !== null) {
		this._toArray(node.left, objects);
		objects.push(node.object);
		this._toArray(node.right, objects);
	}
};

AvlTree.prototype.toArray = function () {
	var objects = [];
	this._toArray(this.root, objects);
	return objects;
};

AvlTree.prototype._isBalanced = function (node) {
	if (node === null) {
		return true;
	}

	var heightLeft  = (node.left  === null) ? 0 : node.left.height;
	var heightRight = (node.right === null) ? 0 : node.right.height;

	if (Math.abs(heightLeft - heightRight) > 1 || node.height <= heightLeft || node.height <= heightRight) {
		return false;
	}

	return this._isBalanced(node.left) && this._isBalanced(node.right);
};

AvlTree.prototype._isSorted = function (node) {
	if (node === null) {
		return true;
	}

	var isSortedLeft  = (node.left  === null) || (this.cmpFunc(node.left.object, node.object)  <= 0);
	var isSortedRight = (node.right === null) || (this.cmpFunc(node.object, node.right.object) <= 0);

	return isSortedLeft && isSortedRight && this._isSorted(node.left) && this._isSorted(node.right);
};

AvlTree.prototype._getCount = function (node) {
	if (node === null) {
		return 0;
	}

	return 1 + this._getCount(node.left) + this._getCount(node.right);
};

module.exports = AvlTree;
