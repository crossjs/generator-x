// sync from: https://github.com/crossjs/plato-validator

import Promise from 'nuo'
import * as rules from './rules'

export default function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  Vue.mixin({
    beforeCreate () {
      const options = this.$options
      const { validator } = options

      if (validator) {
        // 在入口处定义 $validation
        Vue.util.defineReactive(this, '$validation', {
          fields: [],
          errors: []
        })
        this.$validator = this
        nextTick(this, validator.auto)
      } else {
        const { parent } = options
        if (parent && parent.$validation) {
          this.$validation = parent.$validation
          this.$validator = parent.$validator
          nextTick(this, parent.$validator.$options.validator.auto)
        }
      }
    }
  })

  /**
   * $validate
   *
   * validate vm recursively.
   *
   * @return {Promise}
   */
  Vue.prototype.$validate = function (fromEntry) {
    const { validate, $validation = {}, $validator } = this

    // 如果此处为校验入口
    if ($validator === this && !fromEntry) {
      // 顶级往下校验所有子组件
      return Promise.all($validation.fields
        .map(field => field.$validate(true)))
        .then(() => $validation)
        .catch(() => Promise.reject($validation))
    } else {
      if (!validate) {
        return Promise.resolve($validation)
      }
      return Promise.all(Object.keys(validate).map(key => {
        return new Promise((resolve, reject) => {
          const { validator = rules[key], rule, message } = validate[key]
          if (validator) {
            promisify(validator(this.value, rule))
              .then(resolve)
              .catch(() => {
                reject({
                  field: this.field || this,
                  rule,
                  message
                })
              })
          } else {
            console.warn(`'${key}' is NOT a valid validator`)
            resolve()
          }
        })
      })).then(() => {
        updateErrors($validation.errors, this)
        return $validation
      }).catch(error => {
        updateErrors($validation.errors, this, error)
        return Promise.reject($validation)
      })
    }
  }

  plugin.installed = true
}

function updateErrors (errors, vm, replacement) {
  const field = vm.field || vm
  const found = errors.some((error, index) => {
    if (error.field === field) {
      if (replacement) {
        errors.splice(index, 1, replacement)
      } else {
        errors.splice(index, 1)
      }
      return true
    }
    return false
  })

  if (!found && replacement) {
    errors.push(replacement)
  }

  return errors
}

function promisify (val) {
  if (val && val.then && typeof val.then === 'function') {
    return val
  }
  return val ? Promise.resolve(val) : Promise.reject(val)
}

function nextTick (vm, auto) {
  vm.$nextTick(() => {
    // 定义了校验规则
    if (vm.validate) {
      vm.$validation.fields.push(vm)
      // 加载完成自动检查
      if (auto) {
        vm.$validate()
      }
    }
  })
}
