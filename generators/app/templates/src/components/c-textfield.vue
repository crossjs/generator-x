<template>
  <input class="c-textfield"
    :value="value"
    @input="onChange">
</template>

<script>
import mField from './mixins/field'

export default {
  mixins: [mField]
}
</script>

<style src="styles/components/textfield"></style>
