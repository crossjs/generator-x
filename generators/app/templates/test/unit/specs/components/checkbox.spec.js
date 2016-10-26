import Vue from 'vue'
import CCheckbox from 'components/c-checkbox'

describe('checkbox.vue', () => {
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

  it('should toggle value', done => {
    vm = new Vue({
      el,
      template: '<c-checkbox :value="value" @change="change"></c-checkbox>',
      data: {
        value: false
      },
      methods: {
        change (value) {
          this.value = value
        }
      },
      components: {
        CCheckbox
      }
    })

    expect(vm.value).to.equal(false)

    triggerMouseEvents(vm.$children[0].$el, 'click')
    vm.$nextTick(() => {
      expect(vm.value).to.equal(true)
      done()
    })
  })

  it('should toggle value 2', done => {
    vm = new Vue({
      el,
      template: '<c-checkbox :value="value" @change="change"></c-checkbox>',
      data: {
        value: true
      },
      methods: {
        change (value) {
          this.value = value
        }
      },
      components: {
        CCheckbox
      }
    })

    expect(vm.value).to.equal(true)

    triggerMouseEvents(vm.$children[0].$el, 'click')
    vm.$nextTick(() => {
      expect(vm.value).to.equal(false)
      done()
    })
  })

  it('should use true-value/false-value', done => {
    vm = new Vue({
      el,
      template: '<c-checkbox :value="value" :extra="extra" @change="change"></c-checkbox>',
      data: {
        extra: {
          'true-value': 'TRUE',
          'false-value': 'FALSE'
        },
        value: 'FALSE'
      },
      methods: {
        change (value) {
          this.value = value
        }
      },
      components: {
        CCheckbox
      }
    })

    expect(vm.value).to.equal('FALSE')

    triggerMouseEvents(vm.$children[0].$el, 'click')
    vm.$nextTick(() => {
      expect(vm.value).to.equal('TRUE')
      done()
    })
  })
})
