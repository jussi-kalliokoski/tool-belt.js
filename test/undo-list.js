var assert = function (assertion, literal) {
  if (!assertion) throw Error('Assertion error: ' + (literal || 'should be truthy'))
}
var hasOwnProp = Function.call.bind(Object.prototype.hasOwnProperty)

eval(require('fs').readFileSync('undo-list/undo-list.js', 'utf8'))

var noop = function () {}

describe('UndoList', function () {
  describe('[[constructor]]', function () {
    it('should create a new UndoList instance', function () {
      assert(new UndoList() instanceof UndoList)
    })

    it('should define the maxHistory property', function () {
      assert((new UndoList(5)).maxHistory === 5)
    })
  })

  describe('#dodo', function () {
    it('should execute an action', function () {
      var ul = new UndoList()
      var success
      ul.dodo(function () {
        success = true
      }, function () {
        success = false
      })
      assert(success)
    })

    it('should record an action', function () {
      var ul = new UndoList()
      ul.dodo(noop, noop)
      assert(ul.undo())
      assert(ul.redo())
    })
  })

  describe('#undo', function () {
    it('should undo an action', function () {
      var ul = new UndoList()
      var success
      ul.dodo(function () {
        success = true
      }, function () {
        success = false
      })
      ul.undo()
      assert(!success)
    })
  })

  describe('#redo', function () {
    it('should redo an action', function () {
      var ul = new UndoList()
      var success
      ul.dodo(function () {
        success = true
      }, function () {
        success = false
      })
      ul.undo()
      ul.redo()
      assert(success)
    })
  })

  describe('#crop', function () {
    it('should make sure history does not overflow', function () {
      var ul = new UndoList(2)
      var success
      ul.dodo(noop, noop)
      ul.dodo(noop, noop)
      ul.dodo(noop, noop)
      assert(ul.undo())
      assert(ul.undo())
      assert(!ul.undo())
    })
  })
})
