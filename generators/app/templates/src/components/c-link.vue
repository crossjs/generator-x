<template>
  <a class="c-link" :class="size"><slot></slot></a>
</template>

<script>
import mSize from './mixins/size'

export default {
  mixins: [mSize]
}
</script>

<style src="styles/components/link"></style>
