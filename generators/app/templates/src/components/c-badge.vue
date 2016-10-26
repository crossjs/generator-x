<template>
  <i class="c-badge" :class="size"><slot></slot></i>
</template>

<script>
import mSize from './mixins/size'

export default {
  mixins: [mSize]
}
</script>

<style src="styles/components/badge"></style>
