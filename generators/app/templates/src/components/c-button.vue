<template>
  <button class="c-button" :class="size" type="button"><slot></slot></button>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: '',
      validator (value) {
        return /^(x?(large|small))?$/.test(value)
      }
    }
  }
}
</script>

<style src="styles/components/button"></style>
