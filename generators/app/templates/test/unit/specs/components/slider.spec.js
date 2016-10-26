import Vue from 'vue'
import CSlider from 'components/c-slider'

describe('slider.vue', () => {
  let el
  let vm

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
    // sinon.stub(console, 'error')
  })

  afterEach(() => {
    // document.body.removeChild(el)
    vm.$destroy()
    // console.error.restore()
  })

  it('should render correct contents', done => {
    vm = new Vue({
      el,
      template: `<c-slider>
          <div v-for="id in ids" :key="id">{{id}}</div>
        </c-slider>`,
      data: {
        ids: 3
      },
      components: {
        CSlider
      }
    })

    vm.$nextTick(() => {
      expect(vm.$el.querySelector('.c-slider-content').style.webkitTransform).to.equal('translateX(0px)')
      done()
    })
  })

  it('touch', done => {
    vm = new Vue({
      el,
      template: `<c-slider
          @slide="slide">
          <div v-for="id in ids" :key="id">{{id}}</div>
        </c-slider>`,
      data: {
        ids: 3
      },
      methods: {
        slide (index) {
          expect(index).to.equal(1)
          done()
        }
      },
      components: {
        CSlider
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
          pageX: -window.innerWidth,
          pageY: 0
        }]
      })
      triggerTouchEvents(vm.$el, 'touchend')
    })
  })
})
