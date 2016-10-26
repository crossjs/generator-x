<template>
  <div class="c-range"
    @touchstart="dragstart"
    @touchmove="drag"
    @touchend="dragend">
    <div class="c-range-content"
      :style="{'width': '' + (offset / maxOffset * 100) + '%'}"></div>
  </div>
</template>

<script>
export default {
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    value: {
      type: Number
    },
    step: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      offset: 0,
      range: 0,
      maxOffset: 0,
      stepOffset: 0
    }
  },

  watch: {
    value (val) {
      if (!this.dragging) {
        this.offset = (this.value - this.min) / this.range * this.maxOffset
      }
    }
  },

  mounted () {
    this.maxOffset = this.$el.clientWidth
    this.range = this.max - this.min
    this.stepOffset = this.maxOffset / Math.ceil(this.range / this.step)
    const value = typeof this.value === 'number' ? this.value : this.min
    this.offset = (value - this.min) / this.range * this.maxOffset
  },

  methods: {
    dragstart (e) {
      if (!this.dragging && e.touches && e.touches.length === 1) {
        this.dragging = true
        this.startY = e.touches[0].pageX - this.offset
      }
    },
    drag (e) {
      if (this.dragging) {
        e.preventDefault()
        e.stopPropagation()
        const offset = Math.min(this.maxOffset, Math.max(0, e.touches[0].pageX - this.startY))
        this.offset = Math.round(offset / this.stepOffset) * this.stepOffset
        this.$emit('change', parseInt(this.min + this.range * (this.offset / this.maxOffset), 10))
      }
    },
    dragend (e) {
      if (this.dragging) {
        this.dragging = false
      }
    }
  }
}
</script>

<style src="styles/components/range"></style>
