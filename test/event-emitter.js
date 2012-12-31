var assert = function (assertion, literal) {
  if (!assertion) throw Error('Assertion error: ' + (literal || 'should be truthy'))
}
var hasOwnProp = Function.call.bind(Object.prototype.hasOwnProperty)

eval(require('fs').readFileSync('event-emitter/event-emitter.js', 'utf8'))

describe('EventEmitter', function () {
  describe('[[constructor]]', function () {
    it('should create a new EventEmitter instance', function () {
      assert(EventEmitter() instanceof EventEmitter)
      assert(new EventEmitter() instanceof EventEmitter)
    })
  })

  describe('.create()', function () {
    it('should create a mixin with EventEmitter functionality', function () {
      var em = EventEmitter.create({})
      em.initEvents()
      for (var k in EventEmitter.prototype) {
        if (!hasOwnProp(EventEmitter.prototype, k) || typeof EventEmitter.prototype[k] !== 'function') continue
        assert(k in em && typeof em[k] === 'function', 'it should have a ' + k + ' method')
      }
      assert(em._listeners, 'it should have a listeners map')
    })
  })

  describe('.inherit()', function () {
    it('should make the class inherit from EventEmitter', function () {
      var MyEvEm = EventEmitter.inherit(function MyEvEm () {})
      var em = new MyEvEm()
      em.initEvents()
      assert(em instanceof EventEmitter, 'it should be an EventEmitter instance')
      assert(em._listeners, 'it should have a listeners map')
    })

    it('should preserve the prototype', function () {
      function MyEvEm () {}
      MyEvEm.prototype.foo = function () {}
      EventEmitter.inherit(MyEvEm)
      assert('foo' in MyEvEm.prototype)
    })
  })

  describe('#initEvents', function () {
    it('should add a listeners map to the instance', function () {
      var em = EventEmitter()
      assert(!em._listeners)
      em.initEvents()
      assert(em._listeners)
    })
  })

  describe('#emit()', function () {
    it('should emit an event to the listeners', function () {
      var em = new EventEmitter()
      em.initEvents()
      var fired
      em.on('foo', function (a) { fired = a })
      em.emit('foo', [true])
      em.emit('bar', [false])
      assert(fired)
    })
  })

  describe('#on', function () {
    it('should attach a callback to an event', function () {
      var em = new EventEmitter()
      em.initEvents()
      var fired
      em.on('foo', function (a) { fired = a })
      em.emit('foo', [true])
      assert(fired)
    })
  })

  describe('#once', function () {
    it('should attach a callback only to the next instance of the event', function () {
      var em = new EventEmitter()
      em.initEvents()
      var fired
      em.once('foo', function (a) { fired = a })
      em.emit('foo', [true])
      em.emit('foo', [false])
      assert(fired)
    })
  })

  describe('#off', function () {
    it('should detach a callback from an event', function () {
      var em = new EventEmitter()
      em.initEvents()
      var fired
      var cb = function (a) { fired = a }
      em.on('foo', cb)
      em.emit('foo', [true])
      em.off('foo', cb)
      em.emit('foo', [false])
      assert(fired)
    })

    it('should be race-safe', function () {
      var em = new EventEmitter()
      em.initEvents()
      var fired
      var cb1 = function () { em.off('foo', cb1) }
      var cb2 = function (a) { fired = a }
      em.on('foo', cb1)
      em.on('foo', cb2)
      em.emit('foo', [true])
      assert(fired)
    })
  })

  describe('#proxy', function () {
    it('should proxy the calls to the function to the specified event', function () {
      var em = new EventEmitter()
      em.initEvents()
      var fired
      var cb = function (a) { fired = a }
      em.on('foo', cb)
      em.proxy('foo')(true)
      assert(fired)
    })
  })
})
