import Vue from 'vue'
import CToast from 'components/c-toast'

describe('toast.vue', () => {
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
      template: '<c-toast>{{toasts}}</c-toast>',
      data: {
        toasts: 'toasts'
      },
      components: {
        CToast
      }
    })

    expect(vm.$el.textContent).to.equal('toasts')

    vm.toasts = 'toaststoasts'

    vm.$nextTick(() => {
      expect(vm.$el.textContent).to.equal('toaststoasts')
      done()
    })
  })
})
