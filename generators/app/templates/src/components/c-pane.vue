<template>
  <div class="c-pane"
    :class="{'c-pane-flex': flex}"><slot></slot></div>
</template>

<script>
export default {
  props: {
    flex: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style src="styles/components/pane"></style>
