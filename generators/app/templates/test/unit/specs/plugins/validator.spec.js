import Vue from 'vue/dist/vue'
import Validator from 'plugins/validator'

Vue.use(Validator)

describe('validator', () => {
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

  describe('root components (own validator)', () => {
    it('should has $validation, $validate', () => {
      vm = new Vue({
        el,
        validator: {}
      })

      expect(vm).to.have.property('$validation')
      expect(vm).to.have.property('$validate')
    })

    it('should NOT validate while no validate in data', done => {
      vm = new Vue({
        el,
        validator: {
          auto: true
        }
      })

      vm.$nextTick(() => {
        expect(vm.$validation.fields.length).to.equal(0)
        expect(vm.$validation.errors.length).to.equal(0)
        done()
      })
    })

    it('should NOT validate automatically', done => {
      vm = new Vue({
        el,
        data: {
          value: '',
          validate: {
            required: {
              rule: true,
              message: 'Required!'
            }
          }
        },
        validator: {
          auto: false
        }
      })

      const spy = sinon.spy(vm, '$validate')

      vm.$nextTick(() => {
        expect(spy).callCount(0)
        vm.$validate()
        // here is root entry, some trigger twice
        expect(spy).callCount(2)
        vm.$validate()
        expect(spy).callCount(4)
        done()
      })
    })

    it('should validate itself automatically', done => {
      vm = new Vue({
        el,
        data: {
          value: '',
          validate: {
            required: {
              rule: true,
              message: 'Required!'
            }
          }
        },
        validator: {
          auto: true
        }
      })

      vm.$nextTick(() => {
        expect(vm.$validation.fields[0]).to.equal(vm)
        // $validate now is promisify, so use nextTick again
        setTimeout(() => {
          expect(vm.$validation.errors[0]).to.eql({
            field: vm,
            rule: true,
            message: 'Required!'
          })
          done()
        }, 200)
      })
    })
  })

  describe('child components', () => {
    it('should has $validation, $validate', () => {
      Vue.component('comp', {
        template: '<div></div>',
        data () {
          return {
            validate: {
              required: {
                rule: true,
                message: 'Required!'
              }
            }
          }
        }
      })
      vm = new Vue({
        el,
        validator: {},
        template: '<comp></comp>'
      })

      expect(vm.$children[0]).to.have.property('$validation')
      expect(vm.$children[0]).to.have.property('$validate')
    })

    it('should has $validation, $validate 2', () => {
      Vue.component('comp', {
        template: '<div></div>'
      })
      vm = new Vue({
        el,
        validator: {
          auto: true
        },
        template: '<comp></comp>'
      })

      expect(vm.$children[0]).to.have.property('$validation')
      expect(vm.$children[0]).to.have.property('$validate')
    })

    it('should validate successfully', done => {
      Vue.component('comp', {
        template: '<div></div>',
        props: ['value'],
        data () {
          return {
            validate: {
              required: {
                rule: true,
                message: 'Required!'
              }
            }
          }
        }
      })
      vm = new Vue({
        el,
        validator: {
          auto: false
        },
        data: {
          value: 'hello'
        },
        template: '<comp :value="value"></comp>'
      })

      const child = vm.$children[0]
      const { $validation } = child
      expect($validation.errors.length).to.equal(0)
      vm.$validate()
      expect($validation.errors.length).to.equal(0)
      expect(child.value).to.equal('hello')
      vm.value = ''
      vm.$nextTick(() => {
        expect(child.value).to.equal('')
        child.$validate()
        setTimeout(() => {
          expect($validation.errors.length).to.not.equal(0)
          done()
        }, 200)
      })
    })

    it('should NOT validate while no validate in data', done => {
      Vue.component('comp', {
        template: '<div></div>'
      })
      vm = new Vue({
        el,
        template: '<comp></comp>',
        validator: {
          auto: true
        }
      })

      vm.$children[0].$validate()
        .then(() => {
          assert.ok(true, 'ok')
          done()
        })
        .catch(() => {
          assert.ok(false, 'NOT ok')
          done()
        })
    })
  })

  describe('rules', () => {
    function valiate (options, values, cb) {
      vm = new Vue({
        el,
        data: {
          validate: options
        },
        validator: {}
      })
      vm.$nextTick(() => {
        values.reduce((p, [a, b]) => {
          vm.value = a
          return p.then(vm.$validate())
          .then(() => {
            expect(b).to.be.true
          })
          .catch(() => {
            expect(b).to.be.false
          })
        }, Promise.resolve(1)).then(cb).catch(cb)
      })
    }

    it('should validate required', done => {
      valiate({
        required: {
          rule: true,
          message: 'Error!'
        }
      }, [
        ['', false],
        [[], false],
        [[0], true],
        [[''], false],
        [true, true],
        [false, false],
        [{}, false],
        [{ x: 1 }, true],
        [null, false],
        [undefined, false]
      ], done)
    })

    it('should validate minlength', done => {
      valiate({
        minlength: {
          rule: 1,
          message: 'Error!'
        }
      }, [
        ['', false],
        ['ab', true],
        [[], false],
        [[0], true],
        [true, false],
        [false, false],
        [{}, false],
        [{ x: 1 }, false],
        [null, false],
        [undefined, false]
      ], done)
    })

    it('should validate maxlength', done => {
      valiate({
        maxlength: {
          rule: 1,
          message: 'Error!'
        }
      }, [
        ['', true],
        ['ab', false],
        [[], true],
        [[0, 1], false],
        [[''], true],
        [true, false],
        [false, false],
        [{}, false],
        [{ x: 1 }, false],
        [null, false],
        [undefined, false]
      ], done)
    })

    it('should validate min', done => {
      valiate({
        min: {
          rule: 1,
          message: 'Error!'
        }
      }, [
        ['', false],
        ['ab', false],
        [[], false],
        [[1], true],
        [[1, 2], false],
        [true, true],
        [false, false],
        [{}, false],
        [{ x: 1 }, false],
        [null, false],
        [undefined, false]
      ], done)
    })

    it('should validate max', done => {
      valiate({
        max: {
          rule: 1,
          message: 'Error!'
        }
      }, [
        ['', true],
        ['ab', false],
        [[], true],
        [[1], true],
        [[1, 2], false],
        [true, true],
        [false, true],
        [{}, false],
        [{ x: 1 }, false],
        [null, true],
        [undefined, false]
      ], done)
    })

    it('should validate pattern', done => {
      valiate({
        pattern: {
          rule: '/^\\d+$/',
          message: 'Error!'
        }
      }, [
        ['', false],
        ['0', true],
        ['01', true],
        ['01ab', false],
        ['ab', false],
        [[], false],
        [[1], true],
        [[1, 2], false],
        [true, false],
        [false, false],
        [{}, false],
        [{ x: 1 }, false],
        [null, false],
        [undefined, false]
      ], done)
    })

    it('should validate pattern (invalid pattern)', done => {
      valiate({
        pattern: {
          rule: /^\d$/,
          message: 'Error!'
        }
      }, [
        ['123', false]
      ], done)
    })

    it('should validate pattern (invalid pattern 2)', done => {
      valiate({
        pattern: {
          rule: '^\\d$',
          message: 'Error!'
        }
      }, [
        ['123', false]
      ], done)
    })
  })

  describe('stop', () => {
    it('should stop on error', done => {
      vm = new Vue({
        el,
        data: {
          value: 'hello world!',
          validate: {
            pattern: {
              rule: '/^\\S+$/',
              message: 'pattern!'
            },
            maxlength: {
              rule: 8,
              message: 'maxlength!'
            }
          }
        },
        validator: {
          auto: true
        }
      })

      vm.$nextTick(() => {
        setTimeout(() => {
          expect(vm.$validation.errors[0].message).to.equal('pattern!')
          done()
        }, 200)
      })
    })
  })

  describe('misc', () => {
    it('multiple fields', done => {
      Vue.component('comp-a', {
        template: '<div></div>',
        props: ['value'],
        data () {
          return {
            validate: {
              type: {
                rule: 'number',
                message: 'must be a number',
                validator (val, rule) {
                  return typeof val === rule
                }
              }
            }
          }
        }
      })
      Vue.component('comp-b', {
        template: '<div></div>',
        props: ['value'],
        data () {
          return {
            validate: {
              type: {
                rule: 'string',
                message: 'must be a string',
                validator (val, rule) {
                  return typeof val === rule
                }
              }
            }
          }
        }
      })
      vm = new Vue({
        el,
        template: `<div>
            <comp-a :value="valueA"></comp-a>
            <comp-b :value="valueB"></comp-b>
          </div>`,
        data: {
          valueA: 1,
          valueB: 1
        },
        validator: {
          auto: false
        }
      })

      vm.$nextTick(() => {
        vm.$validate().then(() => {
          assert.ok(false, 'NOT ok')
        }).catch($validation => {
          assert.ok(true, 'ok')
          // vm.valueA = 1
          vm.valueB = '1'
          vm.$nextTick(() => {
            vm.$validate().then(() => {
              assert.ok(true, 'ok')
              done()
            }).catch(() => {
              assert.ok(false, 'NOT ok')
              done()
            })
          })
        })
      })
    })

    it('splice error', done => {
      vm = new Vue({
        el,
        data: {
          value: '',
          validate: {
            required: {
              rule: true,
              message: 'required!'
            }
          }
        },
        validator: {
          auto: false
        }
      })

      vm.$nextTick(() => {
        vm.$validate().then(() => {
          assert.ok(false, 'NOT ok')
        }).catch(() => {
          assert.ok(true, 'ok')
          vm.value = 'hello'
          vm.$nextTick(() => {
            vm.$validate().then(() => {
              assert.ok(true, 'ok')
              done()
            }).catch(() => {
              assert.ok(false, 'NOT ok')
              done()
            })
          })
        })
      })
    })

    it('invalid rule', done => {
      vm = new Vue({
        el,
        data: {
          value: '',
          validate: {
            invalid: {
              rule: true,
              message: 'required!'
            }
          }
        },
        validator: {
          auto: false
        }
      })

      vm.$nextTick(() => {
        vm.$validate().then(() => {
          assert.ok(true, 'ok')
          done()
        }).catch(() => {
          assert.ok(false, 'NOT ok')
          done()
        })
      })
    })

    it('customize rule', done => {
      vm = new Vue({
        el,
        data: {
          value: 1,
          validate: {
            mod: {
              rule: 3,
              message: 'mod 4 to equal 3!',
              validator (val, rule) {
                expect(rule).to.equal(3)
                return val % 4 === rule
              }
            }
          }
        },
        validator: {
          auto: false
        }
      })

      vm.$nextTick(() => {
        vm.$validate().then(() => {
          assert.ok(false, 'NOT ok')
          done()
        }).catch(() => {
          assert.ok(true, 'ok')
          vm.value = 3
          vm.$nextTick(() => {
            vm.$validate().then(() => {
              assert.ok(true, 'ok')
              done()
            }).catch(() => {
              assert.ok(false, 'NOT ok')
              done()
            })
          })
        })
      })
    })

    it('customize rule, sync', done => {
      vm = new Vue({
        el,
        data: {
          value: 1,
          validate: {
            mod: {
              rule: 3,
              message: 'mod 4 to equal 3!',
              validator (val, rule) {
                expect(rule).to.equal(3)
                return val % 4 === rule ? Promise.resolve(true) : Promise.reject(false)
              }
            }
          }
        },
        validator: {
          auto: false
        }
      })

      vm.$nextTick(() => {
        vm.$validate().then(() => {
          assert.ok(false, 'NOT ok')
          done()
        }).catch(() => {
          assert.ok(true, 'ok')
          vm.value = 3
          vm.$nextTick(() => {
            vm.$validate().then(() => {
              assert.ok(true, 'ok')
              done()
            }).catch(() => {
              assert.ok(false, 'NOT ok')
              done()
            })
          })
        })
      })
    })
  })
})
