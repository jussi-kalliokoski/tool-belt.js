module.exports = function (grunt) {

var EventEmitter = 'event-emitter/event-emitter.js'
var FrameTimer = 'frame-timer/frame-timer.js'
var UndoList = 'undo-list/undo-list.js'
var utils = 'utils/*.js'

var config = {
	lint: {
		'event-emitter': EventEmitter,
		'frame-timer': FrameTimer,
		'undo-list': UndoList,
		'utils': utils,
		all: [EventEmitter, FrameTimer, UndoList, utils]
	},

	jshint: {
		options: {
			browser: true
		}
	}
}

grunt.initConfig(config)

grunt.registerTask('default', 'lint')

}
