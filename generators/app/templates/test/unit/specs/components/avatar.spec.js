import Vue from 'vue'
import CAvatar from 'components/c-avatar'

describe('avatar.vue', () => {
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
      template: '<c-avatar>PLATO</c-avatar>',
      components: {
        CAvatar
      }
    })

    expect(vm.$children.length).to.equal(1)
    expect(vm.$children[0].$el.textContent).to.equal('PLATO')
  })
})
