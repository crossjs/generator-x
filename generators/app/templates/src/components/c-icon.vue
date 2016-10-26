<template>
  <i class="c-icon" v-html="html"><slot></slot></i>
</template>

<script>
import aMaps from './assets/maps'

export default {
  data () {
    return {
      html: ' '
    }
  },

  beforeMount () {
    this.html = aMaps[this.$slots.default[0].text] || ' '
  }
}

</script>

<style src="styles/components/icon"></style>
