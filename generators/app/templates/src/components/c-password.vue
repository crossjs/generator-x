<template>
  <label class="c-password">
    <c-textfield
      :type="showPassword ? 'text' : 'password'"
      :value="value"
      v-bind="attrs"
      @change="onChange"></c-textfield>
    <c-icon class="c-password-toggle"
      :class="{'active': showPassword}"
      v-tap @tap.native="showPassword = !showPassword">eye</c-icon>
  </label>
</template>

<script>
import CTextfield from './c-textfield'
import CIcon from './c-icon'
import mField from './mixins/field'

export default {
  mixins: [mField],

  props: {
    attrs: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
      showPassword: false
    }
  },

  methods: {
    onChange (value) {
      // override
      this.$emit('change', value)
    }
  },

  components: {
    CTextfield,
    CIcon
  }
}
</script>

<style src="styles/components/password"></style>
