import Vue from 'vue'
import CScroller from 'components/c-scroller'

describe('scroller.vue', () => {
  let el
  let vm

  beforeEach(() => {
    document.documentElement.setAttribute('data-dpr', 1)
    el = document.createElement('div')
    document.body.appendChild(el)
    // sinon.stub(console, 'error')
  })

  afterEach(() => {
    document.documentElement.removeAttribute('data-dpr')
    // document.body.removeChild(el)
    vm.$destroy()
    // console.error.restore()
  })

  it('should render correct contents', done => {
    vm = new Vue({
      el,
      template: '<c-scroller :autoFill="false">hello</c-scroller>',
      components: {
        CScroller
      }
    })

    vm.$nextTick(() => {
      expect(vm.$el.querySelector('.c-scroller-content').textContent.indexOf('hello') !== -1).to.be.true
      done()
    })
  })

  it('autoFill', done => {
    vm = new Vue({
      el,
      template: `<c-scroller
          :height="100"
          :loading="loading"
          @pullup="pullup">
          <div v-for="id in ids" :key="id">{{id}}</div>
        </c-scroller>`,
      data: {
        ids: 0,
        loading: false
      },
      methods: {
        pullup () {
          this.loading = true
          setTimeout(() => {
            this.ids += 10
            this.loading = false
          }, 0)
        }
      },
      components: {
        CScroller
      },
      watch: {
        ids (val) {
          this.$nextTick(() => {
            expect(val).to.equal(10)
            // add 2 indicators
            expect(this.$el.querySelector('.c-scroller-content').children.length).to.equal(val + 2)
            this.$nextTick(() => {
              expect(this.$children[0].maxScroll > 0).to.be.true
              done()
            })
          })
        }
      }
    })
  })

  it('pulldown', done => {
    vm = new Vue({
      el,
      template: `<c-scroller
          :height="100"
          :loading="loading"
          :autoFill="false"
          @pulldown="pulldown">
          <div v-for="id in ids" :key="id">{{id}}</div>
        </c-scroller>`,
      data: {
        ids: 0,
        loading: false
      },
      methods: {
        pulldown () {
          this.loading = true
          setTimeout(() => {
            this.ids = 10
            this.loading = false
          }, 0)
        }
      },
      components: {
        CScroller
      },
      watch: {
        ids (val) {
          expect(val).to.equal(10)
          done()
        }
      }
    })

    vm.$nextTick(() => {
      triggerTouchEvents(vm.$el, 'touchstart', e => {
        e.touches = [{
          pageX: 0,
          pageY: 0
        }]
      })
      triggerTouchEvents(vm.$el, 'touchmove', e => {
        e.touches = [{
          pageX: 0,
          pageY: 240
        }]
      })
      setTimeout(() => {
        triggerTouchEvents(vm.$el, 'touchend')
      }, 300)
    })
  })

  // it('pullup', done => {
  //   vm = new Vue({
  //     el,
  //     template: `<c-scroller
  //         :height="100"
  //         :loading="loading"
  //         :autoFill="false"
  //         @pullup="pullup">
  //         <div v-for="id in ids" :key="id">{{id}}</div>
  //       </c-scroller>`,
  //     data: {
  //       ids: 10,
  //       loading: false
  //     },
  //     methods: {
  //       pullup () {
  //         this.loading = true
  //         setTimeout(() => {
  //           this.ids += 10
  //           this.loading = false
  //         }, 0)
  //       }
  //     },
  //     components: {
  //       CScroller
  //     },
  //     watch: {
  //       ids (val) {
  //         expect(val).to.equal(22)
  //         done()
  //       }
  //     }
  //   })
  //
  //   vm.$nextTick(() => {
  //     const { bounce, threshold } = vm.$children[0]
  //     triggerTouchEvents(vm.$el, 'touchstart', e => {
  //       e.touches = [{
  //         pageX: 0,
  //         pageY: 0
  //       }]
  //     })
  //     triggerTouchEvents(vm.$el, 'touchmove', e => {
  //       e.touches = [{
  //         pageX: 0,
  //         pageY: -threshold * bounce
  //       }]
  //     })
  //     setTimeout(() => {
  //       triggerTouchEvents(vm.$el, 'touchend')
  //     }, 300)
  //   })
  // })

  it('drained', done => {
    vm = new Vue({
      el,
      template: `<c-scroller
          :height="100"
          :drained="drained"
          @pullup="pullup">
          <div v-for="id in ids" :key="id">{{id}}</div>
        </c-scroller>`,
      data: {
        ids: 0,
        drained: true
      },
      methods: {
        pullup () {
          assert.ok(false, 'NOT ok')
        }
      },
      components: {
        CScroller
      }
    })

    vm.$nextTick(() => {
      triggerTouchEvents(vm.$el, 'touchstart', e => {
        e.touches = [{
          pageX: 0,
          pageY: 0
        }]
      })
      triggerTouchEvents(vm.$el, 'touchmove', e => {
        e.touches = [{
          pageX: 0,
          pageY: -240
        }]
      })
      setTimeout(() => {
        triggerTouchEvents(vm.$el, 'touchend')
        setTimeout(done, 300)
      }, 300)
    })
  })

  // it('infinite', done => {
  //   vm = new Vue({
  //     el,
  //     template: `<c-scroller
  //         :height="100"
  //         :autoFill="false"
  //         :infinite="true"
  //         @pullup="pullup">
  //         <div v-for="id in ids" :key="id">{{id}}</div>
  //       </c-scroller>`,
  //     data: {
  //       ids: 10
  //     },
  //     methods: {
  //       pullup () {
  //         done()
  //       }
  //     },
  //     components: {
  //       CScroller
  //     }
  //   })
  //
  //   vm.$nextTick(() => {
  //     const { maxScroll, bounce, threshold } = vm.$children[0]
  //     vm.$el.scrollTop = maxScroll
  //     setTimeout(() => {
  //       triggerTouchEvents(vm.$el, 'touchstart', e => {
  //         e.touches = [{
  //           pageX: 0,
  //           pageY: 0
  //         }]
  //       })
  //       triggerTouchEvents(vm.$el, 'touchmove', e => {
  //         e.touches = [{
  //           pageX: 0,
  //           pageY: -threshold / bounce
  //         }]
  //       })
  //       setTimeout(() => {
  //         triggerTouchEvents(vm.$el, 'touchend')
  //       }, 300)
  //     }, 300)
  //   })
  // })
})
