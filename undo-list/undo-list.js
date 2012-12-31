/*jshint asi:true */

/**
 * A class for managing action history with undo/redo.
 *
 * @class
 *
 * @arg {Number} !maxHistory The maximum number of actions recorded. If not specified, will default to unlimited.
*/
function UndoList (maxHistory) {
	this.list = []
	this.listIndex = -1
	this.maxHistory = maxHistory || 0
}

/**
 * Records an action and its counter-action to the history, and executes the action.
 * Overwrites any future that was recorded.
 *
 * @arg {Function} action The action.
 * @arg {Function} cancel The counter-action.
*/
UndoList.prototype.dodo = function (action, cancel) {
	this.list.splice(++this.listIndex)
	this.list.push([action, cancel])
	this.crop()

	action()
}

/**
 * Undoes the previous action in the history, moving the action to the future.
 *
 * @return {Boolean} A boolean signifying whether there was any action to undo.
*/
UndoList.prototype.undo = function () {
	if (this.listIndex === -1) return false
	this.list[this.listIndex--][1]()

	return true
}

/**
 * Redoes the next action in the future, moving the action to the history.
 *
 * @return {Boolean} A boolean signifying whether there was any action to redo.
*/
UndoList.prototype.redo = function () {
	if (this.listIndex + 1 === this.list.length) return false
	this.list[++this.listIndex][0]()

	return true
}

/**
 * Crops the history size according to the maximum. Automatically called on every dodo.
 *
 * @return {Number} An integer signifying how many items were deleted from the history.
*/
UndoList.prototype.crop = function () {
	if (!this.maxHistory || this.list.length <= this.maxHistory) return 0

	var offset = this.list.length - this.maxHistory
	this.listIndex -= offset
	this.list.splice(0, offset)

	return offset
}
