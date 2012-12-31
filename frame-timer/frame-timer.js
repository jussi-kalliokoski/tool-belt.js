/*jshint asi:true */
var FrameTimer = function (window) {

/**
 * A class for simplifying drawing callbacks.
 *
 * @class
 *
 * @arg {Function} callback The drawing callback.
*/
function FrameTimer (callback) {
	this.callback = callback

	this.fps = 0
	this.frameCount = 0
	this.lastHit = +new Date()

	var self = this

	this._callback = function () {
		self.nextFrame()
	}
	this.fpsTimer = setInterval(function () {
		self.calculateFPS()
	}, 1000)

	this.id = null

	this.start()
}

/**
 * Starts firing the callback.
*/
FrameTimer.prototype.start = function () {
	this.id = FrameTimer.request(this._callback)
}

/**
 * Advances the drawing by one frame, calling the draw callback.
*/
FrameTimer.prototype.nextFrame = function () {
	if (this.stopped) return
	this.frameCount += 1

	if (this.callback) this.callback()

	this.start()
}

/**
 * Stops firing the callback.
*/
FrameTimer.prototype.clear = function () {
	this.stopped = true
	if (this.id !== null) FrameTimer.clear(this.id)
	this.id = null
}

/**
 * Calculates the current FPS of the FrameTimer.
*/
FrameTimer.prototype.calculateFPS = function () {
	var hit = +new Date()
	this.fps = ~~(this.frameCount / (hit - this.lastHit) * 1000)
	this.frameCount = 0
	this.lastHit = hit
}

/**
 * Frees references to flag the FrameTimer for garbage collection.
*/
FrameTimer.prototype.destroy = function () {
	this.clear()
	if (this.fpsTimer !== null) clearInterval(this.fpsTimer)
}

/**
 * A shim for requestAnimationFrame.
*/
FrameTimer.request = function () {
	return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback, element) {
			return window.setTimeout(callback, 1000 / 60)
		}
}()

/**
 * A shim for clearAnimationFrame.
*/
FrameTimer.clear = function () {
	return	window.clearAnimationFrame ||
		window.webkitClearAnimationFrame ||
		window.mozClearAnimationFrame ||
		window.oClearAnimationFrame ||
		window.msClearAnimationFrame ||
		function (id) {
			window.clearTimeout(id)
		}
}()

return FrameTimer

}(window)
