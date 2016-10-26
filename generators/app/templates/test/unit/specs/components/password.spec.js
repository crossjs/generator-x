import Vue from 'vue'
import CPassword from 'components/c-password'
import tap from 'directives/tap'

Vue.directive('tap', tap)

describe('password.vue', () => {
  let el
  let vm

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    // document.body.removeChild(el)
    vm.$destroy()
  })

  it('should render correct contents', done => {
    vm = new Vue({
      el,
      template: '<c-password></c-password>',
      components: {
        CPassword
      }
    })

    expect(vm.$children.length).to.equal(1)
    const { children } = vm.$children[0].$el
    expect(children[0].nodeName).to.equal('INPUT')
    expect(children[0].type).to.equal('password')
    expect(children[1].nodeName).to.equal('I')

    triggerMouseEvents(children[1], 'tap')
    vm.$nextTick(() => {
      expect(children[0].type).to.equal('text')
      done()
    })
  })
})
