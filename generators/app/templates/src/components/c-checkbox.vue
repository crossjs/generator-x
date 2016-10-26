<template>
  <input class="c-checkbox"
    type="checkbox"
    :value="value"
    :checked="_checked"
    @change="onChange">
</template>

<script>
import mField from './mixins/field'

export default {
  mixins: [mField],

  props: {
    // override
    value: {
      default: false
    },
    extra: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  computed: {
    _truthy () {
      if (this.extra.hasOwnProperty('true-value')) {
        return this.extra['true-value']
      }
      return true
    },
    _falsy () {
      if (this.extra.hasOwnProperty('false-value')) {
        return this.extra['false-value']
      }
      return false
    },
    _checked () {
      return this.value === this._truthy
    }
  },

  methods: {
    // override
    onChange (e) {
      this.$emit('change', e.target.checked ? this._truthy : this._falsy)
    }
  }
}
</script>

<style src="styles/components/checkbox"></style>
