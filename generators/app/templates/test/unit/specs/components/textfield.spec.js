import Vue from 'vue'
import CTextfield from 'components/c-textfield'

describe('textfield.vue', () => {
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
      template: '<c-textfield></c-textfield>',
      components: {
        CTextfield
      }
    })

    expect(vm.$children[0].$el.nodeName).to.equal('INPUT')
  })

  it('type', () => {
    vm = new Vue({
      el,
      template: '<c-textfield type="password"></c-textfield>',
      components: {
        CTextfield
      }
    })

    expect(vm.$children.length).to.equal(1)
    expect(vm.$children[0].$el.nodeName).to.equal('INPUT')
    expect(vm.$children[0].$el.type).to.equal('password')
  })
})
