import Vue from 'vue'
import CImage from 'components/c-image'

describe('image.vue', () => {
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
      template: `<div>
        <c-image></c-image>
        <c-image :flexible="0" src="#@1x"></c-image>
        <c-image :flexible="0" src="#@2x"></c-image>
        <c-image :flexible="0" src="#@3x"></c-image>
      </div>`,
      components: {
        CImage
      }
    })

    expect(vm.$children[0].$el.getAttribute('src')).to.have.string('data:image')
    expect(vm.$children[1].$el.getAttribute('src')).to.equal('#@1x')
    expect(vm.$children[2].$el.getAttribute('src')).to.equal('#@2x')
    expect(vm.$children[3].$el.getAttribute('src')).to.equal('#@3x')
  })

  it('dpr: 1', () => {
    vm = new Vue({
      el,
      template: `<div>
        <c-image :flexible="1" :width="10" src="#@1x"></c-image>
        <c-image :flexible="1" :height="10" src="#@2x"></c-image>
        <c-image :flexible="1" :width="10" :height="10" src="#@3x"></c-image>
      </div>`,
      components: {
        CImage
      }
    })

    expect(vm.$children[0].$el.getAttribute('src')).to.equal('#@1x')
    expect(vm.$children[0].$el.getAttribute('width')).to.equal('5')
    expect(vm.$children[1].$el.getAttribute('src')).to.equal('#@1x')
    expect(vm.$children[1].$el.getAttribute('height')).to.equal('5')
    expect(vm.$children[2].$el.getAttribute('src')).to.equal('#@1x')
    expect(vm.$children[2].$el.getAttribute('width')).to.equal('5')
    expect(vm.$children[2].$el.getAttribute('height')).to.equal('5')
  })

  it('dpr: 2', () => {
    vm = new Vue({
      el,
      template: `<div>
        <c-image :flexible="2" :width="10" src="#@1x"></c-image>
        <c-image :flexible="2" :height="10" src="#@2x"></c-image>
        <c-image :flexible="2" :width="10" :height="10" src="#@3x"></c-image>
      </div>`,
      components: {
        CImage
      }
    })

    expect(vm.$children[0].$el.getAttribute('src')).to.equal('#@2x')
    expect(vm.$children[0].$el.getAttribute('width')).to.equal('10')
    expect(vm.$children[1].$el.getAttribute('src')).to.equal('#@2x')
    expect(vm.$children[1].$el.getAttribute('height')).to.equal('10')
    expect(vm.$children[2].$el.getAttribute('src')).to.equal('#@2x')
    expect(vm.$children[2].$el.getAttribute('width')).to.equal('10')
    expect(vm.$children[2].$el.getAttribute('height')).to.equal('10')
  })

  it('dpr: 3', () => {
    vm = new Vue({
      el,
      template: `<div>
        <c-image :flexible="3" :width="10" src="#@1x"></c-image>
        <c-image :flexible="3" :height="10" src="#@2x"></c-image>
        <c-image :flexible="3" :width="10" :height="10" src="#@3x"></c-image>
      </div>`,
      components: {
        CImage
      }
    })

    expect(vm.$children[0].$el.getAttribute('src')).to.equal('#@3x')
    expect(vm.$children[0].$el.getAttribute('width')).to.equal('15')
    expect(vm.$children[1].$el.getAttribute('src')).to.equal('#@3x')
    expect(vm.$children[1].$el.getAttribute('height')).to.equal('15')
    expect(vm.$children[2].$el.getAttribute('src')).to.equal('#@3x')
    expect(vm.$children[2].$el.getAttribute('width')).to.equal('15')
    expect(vm.$children[2].$el.getAttribute('height')).to.equal('15')
  })
})
