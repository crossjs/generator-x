import Vue from 'vue'
import CModal from 'components/c-modal'
import tap from 'directives/tap'

Vue.directive('tap', tap)

describe('modal.vue', () => {
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
      template: `<c-modal
        :show="show"
        :actions="actions">hello?</c-modal>`,
      data: {
        show: true,
        actions: {
          cancel: {
            label: 'Cancel',
            'class': 'primary'
          },
          submit: {
            label: 'Submit',
            'class': 'primary'
          }
        }
      },
      components: {
        CModal
      }
    })

    // only .content
    expect(vm.$children[0].$el.children.length).to.equal(1)
    expect(vm.$el.querySelector('.c-modal-body').textContent).to.equal('hello?')
    expect(vm.$el.querySelector('.c-modal-actions')).to.not.equal(null)

    // update actions
    vm.actions = null
    vm.$nextTick(() => {
      expect(vm.$el.querySelector('.c-modal-actions')).to.equal(null)
      done()
    })
  })

  it('should respond actions', done => {
    vm = new Vue({
      el,
      template: `<c-modal
        :show="show"
        @cancel="callback('cancel')"
        @submit="callback('submit')">hello?</c-modal>`,
      data: {
        show: true
      },
      methods: {
        callback (key) {
          if (key === 'cancel') {
            triggerMouseEvents(vm.$el.querySelectorAll('a.c-modal-link')[1], 'tap')
          } else {
            expect(vm.show).to.be.true
            vm.show = false
            vm.$nextTick(() => {
              expect(vm.show).to.be.false
              done()
            })
          }
        }
      },
      components: {
        CModal
      }
    })

    // button
    triggerMouseEvents(vm.$el.querySelectorAll('a.c-modal-link')[0], 'tap')
  })

  it('should show/hide modal', done => {
    vm = new Vue({
      el,
      template: '<c-modal :show="show">hello?</c-modal>',
      data: {
        show: false
      },
      components: {
        CModal
      }
    })

    const { style } = vm.$children[0].$el

    expect(style.display).to.equal('none')

    vm.show = true
    vm.$nextTick(() => {
      expect(style.display).to.equal('')
      done()
    })
  })

  it('should NOT prevent close', done => {
    vm = new Vue({
      el,
      template: `<c-modal
        :show="show"
        @cancel="callback">hello?</c-modal>`,
      data: {
        show: true
      },
      methods: {
        callback () {
          expect(vm.show).to.be.true
          vm.show = false
          vm.$nextTick(() => {
            expect(vm.show).to.be.false
            done()
          })
          return false
        }
      },
      components: {
        CModal
      }
    })

    const modal = vm.$children[0]

    // button
    triggerMouseEvents(modal.$el.querySelector('a:first-child'), 'tap')
  })
})
