// sync from: https://github.com/crossjs/plato-i18n

import template from 'string-template'

export default function plugin (Vue, globalOptions = {}) {
  if (plugin.installed) {
    return
  }

  Vue.mixin({
    beforeCreate () {
      const { i18n } = this.$options

      // 当前组件有 i18n
      if (i18n) {
        // 在入口处定义 $i18n
        Vue.util.defineReactive(this, '$i18n', { ...globalOptions, ...i18n })
      } else if (this.$parent) {
        // 否则指向父对象的 i18n
        this.$i18n = this.$parent.$i18n
      } else {
        // 使用默认
        Vue.util.defineReactive(this, '$i18n', { ...globalOptions })
      }
    }
  })

  /**
   * 翻译字符串
   *
   * Example:
   * ```
   * {
   *   foo: { bar: 'baz' },
   *   v: { a: '1{r}2' },
   *   x: { a: '3{0}4' }
   * }
   * __('foo.bar') -> 'baz'
   * __('v.a', { r: 'hello' }) -> '1hello2'
   * __('x.a', ['world']) -> '3world4'
   * ```
   *
   * @method $translate
   * @alias  __
   * @param  {String}         keys    待翻译 Key
   * @param  {Array|Object}   [args]  模板变量
   * @return {String}                 翻译结果
   */
  Vue.prototype.__ = Vue.prototype.$translate = function (keys, ...args) {
    if (!keys || !this.$i18n || typeof this.$i18n.data !== 'function') {
      return keys
    }
    // `.` 作为分隔符
    return template(keys.split('.').reduce((res, key) => {
      if (res && typeof res === 'object' && res.hasOwnProperty(key)) {
        return res[key]
      }
      return keys
    }, this.$i18n.data()), ...args)
  }

  plugin.installed = true
}
