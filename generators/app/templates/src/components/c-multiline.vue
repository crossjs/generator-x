<template>
  <textarea class="c-multiline"
    @input="onChange">{{value}}</textarea>
</template>

<script>
import mField from './mixins/field'

export default {
  mixins: [mField]
}
</script>

<style src="styles/components/multiline"></style>
