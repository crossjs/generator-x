<!-- Inspired by https://facebook.github.io/react-native/docs/picker.html -->
<template>
  <div class="c-picker"
    :style="{'height': itemHeight * size + 'px'}"
    @touchstart="dragstart"
    @touchmove="drag"
    @touchend="dragend">
    <div class="c-picker-cover"
      :style="{'background-size': '100% ' + (size - 1) / 2 * itemHeight + 'px'}">
      <div class="c-picker-highlight"
        :style="{'height': itemHeight + 'px', 'transform': 'translateY(' + ((size - 1) / 2 * itemHeight) + 'px)'}"></div>
    </div>
    <div class="c-picker-content" :class="{'transition' : transition}"
      :style="{transform: 'translateY(' + offset + 'px)'}"
      ref="content"><slot></slot></div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0,
      validator (val) {
        return val >= 0
      }
    },
    size: {
      type: Number,
      default: 7,
      validator (val) {
        return val >= 3 && val % 2 === 1
      }
    },
    transition: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      offset: 0,
      itemHeight: 0,
      // 是否有内容
      itemLength: 0
    }
  },

  computed: {
    maxOffset () {
      return this.itemHeight * (this.size - 1) / 2
    },
    minOffset () {
      return this.itemHeight * ((this.size + 1) / 2 - this.itemLength)
    }
  },

  watch: {
    index () {
      if (!this.dragging) {
        this.updateOffset()
      }
    },
    size () {
      this.updateOffset()
    }
  },

  mounted () {
    const { children } = this.$refs.content
    this.itemLength = children.length
    if (this.itemLength) {
      this.itemHeight = children[0].clientHeight
      this.updateOffset()
    }
  },

  updated () {
    const { children } = this.$refs.content
    if (this.itemLength !== children.length) {
      this.itemLength = children.length
      if (this.itemLength) {
        this.itemHeight = children[0].clientHeight
        this.updateOffset()
      } else {
        this.itemHeight = 0
        this.offset = 0
      }
    }
  },

  methods: {
    updateOffset () {
      let index = this.index
      if (this.index > this.itemLength - 1) {
        index = this.itemLength - 1
        this.$emit('change', index)
      }
      this.offset = this.itemHeight * ((this.size - 1) / 2 - index)
    },
    dragstart (e) {
      if (!this.dragging && e.touches && e.touches.length === 1) {
        this.dragging = true
        this.startY = e.touches[0].pageY - this.offset
      }
    },
    drag (e) {
      if (this.dragging) {
        e.preventDefault()
        e.stopPropagation()
        this.offset = Math.min(this.maxOffset, Math.max(this.minOffset, e.touches[0].pageY - this.startY))
      }
    },
    dragend (e) {
      if (this.dragging) {
        this.dragging = false
        const offsetIndex = Math.max((this.size - 1) / 2 - this.itemLength, Math.round(this.offset / this.itemHeight))
        this.offset = this.itemHeight * offsetIndex
        const index = (this.size - 1) / 2 - offsetIndex
        if (index !== this.index) {
          this.$emit('change', index)
        }
      }
    }
  }
}
</script>

<style src="styles/components/picker"></style>
