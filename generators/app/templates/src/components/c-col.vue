<template>
  <div class="c-col" :class="typeof size === 'number' ? 'c-col-' + size : null"><slot></slot></div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number
    }
  }
}
</script>

<style src="styles/components/col"></style>
