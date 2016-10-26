import Vue from 'vue'
import CUpload from 'components/c-upload'
import tap from 'directives/tap'

Vue.directive('tap', tap)

describe('upload.vue', () => {
  let el
  let vm

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    vm.$destroy()
  })

  it('should render correct contents', () => {
    vm = new Vue({
      el,
      template: '<c-upload></c-upload>',
      components: {
        CUpload
      }
    })

    expect(vm.$children.length).to.equal(1)
    expect(vm.$children[0].$refs.file.style.display).to.equal('none')
  })

  it('should call change hook when upload file', done => {
    const file = {
      name: 'test.txt',
      toString () {
        return this.name
      }
    }

    const files = [file]

    files.item = i => files[i]

    const spy = sinon.spy()
    const preventDefault = sinon.spy()
    vm = new Vue({
      el,
      template: '<c-upload @change="change" :action="action" :data="data"></c-upload>',
      methods: {
        change (ret, file) {
          this.file = file
          spy()
        }
      },
      data: {
        action: '/upload',
        data: {}
      },
      components: {
        CUpload
      }
    })

    vm.$children[0].onChange({
      target: { files }
    })
    expect(spy).called
    expect(vm.file.name).to.equal(file.name)
    expect(vm.file).to.have.property('uid')

    vm.$children[0].onFileDrop({
      dataTransfer: {
        files
      },
      preventDefault
    })
    expect(spy).called
    expect(preventDefault).called
    expect(vm.file.name).to.equal(file.name)
    expect(vm.file).to.have.property('uid')

    done()
  })

  it('should not upload if no action', done => {
    const file = {
      name: 'test.txt',
      toString () {
        return this.name
      }
    }

    const files = [file]

    files.item = i => files[i]

    const spy = sinon.spy()
    vm = new Vue({
      el,
      template: '<c-upload @change="change"></c-upload>',
      methods: {
        change (ret, file) {
          this.file = file
          this.percent = ret.percent
          spy()
        }
      },
      components: {
        CUpload
      }
    })

    vm.$children[0].onChange({
      target: { files }
    })
    expect(spy).called
    expect(vm.$children[0].aciton).to.be.empty
    expect(vm.percent).to.equal(0)
    done()
  })

  it('should not call change hook if trigger is dragover', done => {
    const file = {
      name: 'test.txt',
      toString () {
        return this.name
      }
    }

    const files = [file]

    files.item = i => files[i]

    const spy = sinon.spy()
    const preventDefault = sinon.spy()
    vm = new Vue({
      el,
      template: '<c-upload @change="change"></c-upload>',
      methods: {
        change (ret, file) {
          this.file = file
          this.percent = ret.percent
          spy()
        }
      },
      components: {
        CUpload
      }
    })

    vm.$children[0].onFileDrop({
      dataTransfer: {
        files
      },
      preventDefault,
      type: 'dragover'
    })
    expect(preventDefault).called
    expect(vm.file).to.be.undefined
    expect(vm.percent).to.be.undefined
    done()
  })
})
