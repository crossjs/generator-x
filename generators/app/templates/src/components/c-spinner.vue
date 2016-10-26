<template>
  <i class="c-spinner" :class="[theme, size]"></i>
</template>

<script>
import mSize from './mixins/size'

export default {
  mixins: [mSize],

  props: {
    theme: {
      type: String,
      default: 'snake'
    }
  }
}
</script>

<style src="styles/components/spinner"></style>
