/*jshint asi:true */
var EventEmitter = function () {
"use strict";

var hasOwnProp = Function.call.bind(Object.prototype.hasOwnProperty)
var defineProperty = Object.defineProperty

var defineValue = function (obj, name, value) {
	defineProperty(obj, name, {
		value: value,
		writable: true,
		configurable: true
	})
}

/**
 * A class for managing objects that emit events.
 *
 * @class
*/
function EventEmitter () {
	if ( !(this instanceof EventEmitter) ) return new EventEmitter()
}

/**
 * Emits an event.
 *
 * @arg {String} name The name of the event.
 * @arg {Array} args The arguments to pass to the listeners.
*/
EventEmitter.prototype.emit = function (name, args) {
	var listeners, i

	if (!this._listeners[name]) return

	listeners = this._listeners[name].slice()

	for (i=0; i<listeners.length; i++) {
		listeners[i].apply(this, args)
	}
}

/**
 * Adds an event listener.
 *
 * @arg {String} name The name of the event.
 * @arg {Function} listener The listener for the event.
*/
EventEmitter.prototype.on = function (name, listener) {
	this._listeners[name] = this._listeners[name] || []
	this._listeners[name].push(listener)
}

/**
 * Removes an event listener.
 *
 * @arg {String} name The name of the event.
 * @arg {Function} !listener The listener to be removed. If not specified, removes all listeners on that event.
 *
 * @return {Object} this context of the method call.
*/
EventEmitter.prototype.off = function (name, listener) {
	if (!this._listeners[name]) return

	if (!listener) {
		delete this._listeners[name]
		return
	}

	for (var i=0; i<this._listeners[name].length; i++) {
		if (this._listeners[name][i] !== listener) continue

		this._listeners[name].splice(i--, 1)
	}

	if (!this._listeners[name].length) {
		delete this._listeners[name]
	}
}

/**
 * Adds a one-shot event listener that gets removed after it has been called once.
 *
 * @arg {String} name The name of the event.
 * @arg {Function} listener The listener for the event.
*/
EventEmitter.prototype.once = function (name, listener) {
	this.on(name, function cb () {
		this.off(name, cb)

		return listener.apply(this, arguments)
	})
}

/**
 * Creates a callback function that redirects calls of the callback to an event.
 *
 * @arg {String} name The name of the event.
 *
 * @return {Function} The callback function.
*/
EventEmitter.prototype.proxy = function (name) {
	var self = this

	return function () {
		self.emit(name, arguments)
	}
}

/**
 * Starts the EventEmitter service.
*/
EventEmitter.prototype.initEvents = function () {
	defineValue(this, '_listeners', {})
}

/**
 * Makes a specified existing object implement EventEmitter.
 *
 * @arg {Object} object The object to implement EventEmitter.
 *
 * @return {Object} The `object` argument.
*/

EventEmitter.create = function (object) {
	for (var k in EventEmitter.prototype) {
		if (!hasOwnProp(EventEmitter.prototype, k)) continue

		defineValue(object, k, EventEmitter.prototype[k])
	}

	object.initEvents()

	return object
}

/**
 * Makes a specified existing class inherit from EventEmitter.
 *
 * @arg {Function} cls The class that should inherit from EventEmitter.
 *
 * @return {Function} Returns the class argument.
*/
EventEmitter.inherit = function (cls) {
	var prototype = cls.prototype
	cls.prototype = new EventEmitter()

	for (var k in prototype) {
		if (!hasOwnProp(prototype, k)) continue

		cls.prototype[k] = prototype[k]
	}

	return cls
}

return EventEmitter

}()
