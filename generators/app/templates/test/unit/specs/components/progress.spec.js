import Vue from 'vue'
import CProgress from 'components/c-progress'

describe('progress.vue', () => {
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
      template: `<c-progress
        :progress="progress"></c-progress>`,
      data: {
        progress: 0
      },
      components: {
        CProgress
      }
    })

    expect(vm.progress).to.equal(0)
    vm.progress = 50
    expect(vm.progress).to.equal(50)

    vm.$nextTick(() => {
      expect(vm.$children[0].$el.children[0].style.webkitTransform).to.equal('translateX(-50%)')
      done()
    })
  })
})
