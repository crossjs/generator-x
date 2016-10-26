<template>
  <div class="c-navbar">
    <transition name="fade">
      <c-mask v-show="opened"
        v-tap @tap.native="opened = false"></c-mask>
    </transition>
    <c-button class="c-navbar-toggle"
      :class="{'active': opened}"
      v-tap @tap.native="opened = !opened">
      <slot name="icon"><c-icon>three-bars</c-icon></slot>
    </c-button>
    <nav class="c-navbar-menu"
      :class="{'opened': opened}"
      v-tap.delay @tap="opened = false">
      <slot></slot>
    </nav>
  </div>
</template>

<script>
import CMask from './c-mask'
import CIcon from './c-icon'
import CButton from './c-button'

export default {
  data () {
    return {
      opened: false
    }
  },

  components: {
    CMask,
    CIcon,
    CButton
  }
}
</script>

<style src="styles/components/navbar"></style>
