import Vue from 'vue'
import CIcon from 'components/c-icon'
import aMaps from 'components/assets/maps'

describe('icon.vue', () => {
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

  it('should render correct contents', () => {
    vm = new Vue({
      el,
      template: '<c-icon>PLATO</c-icon>',
      components: {
        CIcon
      }
    })

    expect(vm.$children.length).to.equal(1)
    expect(vm.$children[0].$el.textContent).to.equal(' ')
  })

  it('should render correct contents 2', () => {
    vm = new Vue({
      el,
      template: '<c-icon>eye</c-icon>',
      components: {
        CIcon
      }
    })

    expect(vm.$children.length).to.equal(1)
    expect(vm.$children[0].$el.textContent).to.equal(String.fromCharCode(parseInt(aMaps.eye.replace(/[^0-9a-f]/ig, ''), 16)))
  })
})
