import Vue from 'vue'
import CButton from 'components/c-button'

describe('button.vue', () => {
  let el
  let vm

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
    sinon.stub(console, 'error')
  })

  afterEach(() => {
    // document.body.removeChild(el)
    vm.$destroy()
    console.error.restore()
  })

  it('should render correct contents', () => {
    vm = new Vue({
      el,
      template: '<c-button>PLATO</c-button>',
      components: {
        CButton
      }
    })

    expect(vm.$children.length).to.equal(1)
    expect(vm.$children[0].$el.textContent).to.equal('PLATO')
    expect(vm.$children[0].$el.type).to.equal('button')
  })

  it('type', () => {
    vm = new Vue({
      el,
      template: `<div>
        <c-button type="submit"></c-button>
        <c-button type="button"></c-button>
        <c-button type="reset"></c-button>
        <c-button type=""></c-button>
        <c-button type="invalid"></c-button>
        <c-button></c-button>
      </div>`,
      components: {
        CButton
      }
    })

    expect(vm.$children[0].$el.type).to.equal('submit')
    expect(vm.$children[1].$el.type).to.equal('button')
    expect(vm.$children[2].$el.type).to.equal('reset')
    expect(vm.$children[3].$el.type).to.equal('submit')
    expect(vm.$children[3].$el.getAttribute('type')).to.equal('')
    expect(vm.$children[4].$el.type).to.equal('submit')
    expect(vm.$children[4].$el.getAttribute('type')).to.equal('invalid')
    expect(vm.$children[5].$el.type).to.equal('button')
  })

  it('class', () => {
    vm = new Vue({
      el,
      template: `<div>
        <c-button class="xlarge"></c-button>
        <c-button class="large"></c-button>
        <c-button class="small"></c-button>
        <c-button class="xsmall"></c-button>
        <c-button class="invalid"></c-button>
        <c-button></c-button>
      </div>`,
      components: {
        CButton
      }
    })

    expect(vm.$children[0].$el.className).to.equal('c-button xlarge')
    expect(vm.$children[1].$el.className).to.equal('c-button large')
    expect(vm.$children[2].$el.className).to.equal('c-button small')
    expect(vm.$children[3].$el.className).to.equal('c-button xsmall')
    expect(vm.$children[4].$el.className).to.equal('c-button invalid')
    expect(vm.$children[5].$el.className).to.equal('c-button')
  })

  it('size', () => {
    vm = new Vue({
      el,
      template: `<div>
        <c-button size="xlarge"></c-button>
        <c-button size="large"></c-button>
        <c-button size="small"></c-button>
        <c-button size="xsmall"></c-button>
        <c-button size="invalid"></c-button>
        <c-button></c-button>
      </div>`,
      components: {
        CButton
      }
    })

    // should warn 'invalid'
    expect(console.error.calledOnce).to.be.true

    expect(vm.$children[0].$el.className).to.have.string(' xlarge')
    expect(vm.$children[1].$el.className).to.have.string(' large')
    expect(vm.$children[2].$el.className).to.have.string(' small')
    expect(vm.$children[3].$el.className).to.have.string(' xsmall')
    expect(vm.$children[4].$el.className).to.have.string(' invalid')
    expect(vm.$children[5].$el.className).to.not.have.string(' ')
  })
})
