<template>
  <div class="c-scroller"
    :style="{'height': height + 'px'}"
    @touchstart="dragstart"
    @touchmove="drag"
    @touchend="dragend">
    <div class="c-scroller-container"
      :style="{height: maxHeight + 'px'}">
      <div class="c-scroller-content"
        :class="{'transition' : transition}"
        :style="{transform: 'translateY(' + offset + 'px)'}"
        ref="content">
        <div class="c-scroller-indicator c-scroller-indicator-down"
          ref="indicator">
          <slot v-if="pullState === 2" name="down-go"><c-icon class="down-go">arrow-small-up</c-icon></slot>
          <slot v-if="pullState === 1" name="down-ready"><c-icon class="down-ready">arrow-small-down</c-icon></slot>
          <slot v-if="loading && pullState === 3" name="down-spinner"><c-spinner></c-spinner></slot>
        </div>
        <slot></slot>
        <div class="c-scroller-indicator c-scroller-indicator-up">
          <slot v-if="loading && pullState === -3" name="up-spinner"><c-spinner></c-spinner></slot>
          <slot v-if="!infinite && pullState === -1" name="up-ready"><c-icon class="up-ready">arrow-small-down</c-icon></slot>
          <slot v-if="!infinite && pullState === -2" name="up-go"><c-icon class="up-go">arrow-small-up</c-icon></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CIcon from './c-icon'
import CSpinner from './c-spinner'

export default {
  props: {
    height: {
      type: Number,
      default: 0
    },
    bounce: {
      type: Number,
      default: 1.25
    },
    loading: {
      type: Boolean,
      default: false
    },
    drained: {
      type: Boolean,
      default: false
    },
    infinite: {
      type: Boolean,
      default: false
    },
    autoFill: {
      type: Boolean,
      default: true
    },
    transition: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      offset: 0,
      // 临界阈值
      threshold: 0,
      // 推拉状态
      pullState: 0,
      // 溢出距离
      maxScroll: 0,
      maxHeight: 0
    }
  },

  watch: {
    loading (val) {
      if (!val) {
        this.fill()
        this.reset()
      }
    },
    drained (val) {
      if (val) {
        this.update()
        this.reset()
      }
    }
  },

  mounted () {
    this.threshold = this.$refs.indicator.clientHeight * this.bounce
    this.fill()
  },

  methods: {
    // reset postion
    reset () {
      this.$nextTick(() => {
        // 复位
        this.offset = 0
      })
    },
    // fill content automatically
    fill () {
      this.$nextTick(() => {
        this.update()
        if (!this.drained && this.autoFill && !this.maxScroll) {
          this.pullup()
        }
      })
    },
    // update min offset and maxScroll state
    update () {
      this.maxHeight = this.$refs.content.clientHeight
      this.maxScroll = Math.max(0, this.maxHeight - this.height)
    },
    dragstart (e) {
      if (!this.dragging && e.touches && e.touches.length === 1) {
        this.dragging = true
        // reset pull state
        this.pullState = 0
        this.startY = e.touches[0].pageY - this.offset
      }
    },
    drag (e) {
      if (!this.dragging) {
        return
      }
      if (this.infinite && this.pullState === -3) {
        return
      }
      const _distance = e.touches[0].pageY - this.startY
      const isDown = _distance > 0 && this.$el.scrollTop === 0
      const isUp = _distance < 0 && this.$el.scrollTop >= this.maxScroll
      if (!isDown && !isUp) {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      const distance = Math.min(this.threshold, _distance)
      this.offset = this.maxScroll
        ? Math.max(this.drained ? 0 : -this.threshold, distance)
        : isDown ? distance : 0
      if (this.pullState < 3 && this.pullState > -3) {
        if (this.offset > 0) {
          // pulldown
          this.pullState = this.offset > this.threshold / this.bounce ? 2 : 1
        } else if (this.offset < 0) {
          // pullup
          if (!this.drained) {
            if (this.maxScroll) {
              this.pullState = -this.offset > this.threshold / this.bounce ? -2 : -1
            }
            if (this.infinite && this.pullState === -1) {
              this.pullup()
            }
          }
        }
      }
    },
    dragend (e) {
      if (!this.dragging) {
        return
      }
      this.dragging = false
      if (this.infinite) {
        if (this.pullState < 0) {
          return
        }
      }
      if (this.pullState === -2) {
        this.pullup()
        return
      }
      if (this.pullState === 2) {
        this.pulldown()
        return
      }
      this.reset()
    },
    pulldown () {
      this.pullState = 3
      this.offset = this.threshold / this.bounce
      this.$emit('pulldown')
      this.$nextTick(() => {
        // 如果外部未处理 pulldown，则重置
        if (!this.loading) {
          this.reset()
        }
      })
    },
    pullup () {
      this.pullState = -3
      this.offset = this.maxScroll ? -this.threshold / this.bounce : 0
      this.$emit('pullup')
      this.$nextTick(() => {
        // 如果外部未处理 pullup，则重置
        if (!this.loading) {
          this.reset()
        }
      })
    }
  },

  components: {
    CIcon,
    CSpinner
  }
}
</script>

<style src="styles/components/scroller"></style>
