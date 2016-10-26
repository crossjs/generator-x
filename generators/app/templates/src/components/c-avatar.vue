<template>
  <i class="c-avatar" :class="size"><slot></slot></i>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: '',
      validator (value) {
        return /^(large|small)?$/.test(value)
      }
    }
  }
}
</script>

<style src="styles/components/avatar"></style>
