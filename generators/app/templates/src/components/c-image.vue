<template>
  <img class="c-image"
    :src="_src"
    :width="_width"
    :height="_height">
</template>

<script>
/* globals lib */
const { dpr } = typeof lib === 'object' ? lib.flexible : { dpr: 2 }

export default {
  props: {
    src: {
      type: String,
      default: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    },
    width: {
      type: [String, Number]
    },
    height: {
      type: [String, Number]
    },
    flexible: {
      type: Number,
      // -1: use global flexible dpr
      // 0: disable flexible dpr
      // 1-3: customize flexible dpr
      default: -1,
      validator (val) {
        return val >= -1 && val <= 3
      }
    }
  },

  computed: {
    _dpr () {
      return this.flexible === -1 ? dpr : this.flexible
    },
    _src () {
      return this._dpr ? this.src.replace(/@[1-3]x/g, '@' + this._dpr + 'x') : this.src
    },
    _width () {
      return this._dpr ? this.width ? this.width * this._dpr / 2 : this.width : this.width
    },
    _height () {
      return this._dpr ? this.height ? this.height * this._dpr / 2 : this.height : this.height
    }
  }
}
</script>

<style src="styles/components/image"></style>
