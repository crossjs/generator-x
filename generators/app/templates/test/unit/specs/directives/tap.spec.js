import Vue from 'vue'
import tap from 'directives/tap'

Vue.directive('tap', tap)

describe('tap', () => {
  let el
  let vm

  const threshold = window.innerWidth / 10

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    // document.body.removeChild(el)
    vm.$destroy()
  })

  it('should dispatch tap event', done => {
    vm = new Vue({
      el,
      template: '<div v-tap @tap="onTap"></div>',
      methods: {
        onTap () {
          assert.ok(Date.now() - start < 300, 'should NOT have delay')
          done()
        }
      }
    })

    const start = Date.now()

    triggerTouchEvents(vm.$el, 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchmove', e => {
      e.touches = [{
        pageX: threshold - 1,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchend')
  })

  it('should NOT dispatch tap event', done => {
    vm = new Vue({
      el,
      template: '<div v-tap @tap="onTap"></div>',
      methods: {
        onTap () {
          assert.ok(false, 'should NOT be called')
        }
      }
    })

    triggerTouchEvents(vm.$el, 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchmove', e => {
      e.touches = [{
        pageX: threshold,
        pageY: threshold
      }]
    })
    triggerTouchEvents(vm.$el, 'touchend')

    setTimeout(done, 500)
  })

  it('should dispatch tap event with delay', done => {
    vm = new Vue({
      el,
      template: '<div v-tap.delay @tap="onTap"></div>',
      methods: {
        onTap () {
          assert.ok((Date.now() - start > 300) && (Date.now() - start < 500), 'should have 300ms delay be default')
          done()
        }
      }
    })

    const start = Date.now()

    triggerTouchEvents(vm.$el, 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchmove', e => {
      e.touches = [{
        pageX: threshold - 1,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchend')
  })

  it('should dispatch tap event with given delay', done => {
    vm = new Vue({
      el,
      template: '<div v-tap.delay="500" @tap="onTap"></div>',
      methods: {
        onTap () {
          assert.ok(Date.now() - start > 500, 'should have 300ms delay be default')
          done()
        }
      }
    })

    const start = Date.now()

    triggerTouchEvents(vm.$el, 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchmove', e => {
      e.touches = [{
        pageX: threshold - 1,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchend')
  })
})
